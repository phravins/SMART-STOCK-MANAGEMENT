from datetime import datetime
import uuid
import logging
import os
from twilio.rest import Client
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

class AlertService:
    def __init__(self, db):
        self.db = db
        
        # Initialize Twilio client
        self.twilio_enabled = False
        try:
            account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
            auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
            self.whatsapp_from = os.environ.get('TWILIO_WHATSAPP_FROM')
            self.whatsapp_to = os.environ.get('TWILIO_WHATSAPP_TO')
            
            if account_sid and auth_token and self.whatsapp_from and self.whatsapp_to:
                self.twilio_client = Client(account_sid, auth_token)
                self.twilio_enabled = True
                logger.info(" Twilio WhatsApp integration enabled")
            else:
                logger.warning(" Twilio credentials not found, using mock notifications")
        except Exception as e:
            logger.error(f"Failed to initialize Twilio: {str(e)}")
            self.twilio_enabled = False
        
        # Initialize Email configuration
        self.email_enabled = False
        try:
            self.mail_server = os.environ.get('MAIL_SERVER')
            self.mail_port = int(os.environ.get('MAIL_PORT', 587))
            self.mail_username = os.environ.get('MAIL_USERNAME')
            self.mail_password = os.environ.get('MAIL_PASSWORD')
            self.mail_from = os.environ.get('MAIL_DEFAULT_SENDER')
            self.mail_to = os.environ.get('ALERT_EMAIL_TO')
            
            if all([self.mail_server, self.mail_username, self.mail_password, self.mail_from, self.mail_to]):
                self.email_enabled = True
                logger.info(" Email integration enabled")
            else:
                logger.warning(" Email credentials not found, using mock notifications")
        except Exception as e:
            logger.error(f"Failed to initialize Email: {str(e)}")
            self.email_enabled = False

    async def check_and_generate_alerts(self):
        """Check all products and generate alerts"""
        products = await self.db.products.find().to_list(1000)
        alerts_generated = []

        for product in products:
            # Check low stock
            low_stock_alert = await self._check_low_stock(product)
            if low_stock_alert:
                alerts_generated.append(low_stock_alert)

            # Check demand surge
            demand_alert = await self._check_demand_surge(product)
            if demand_alert:
                alerts_generated.append(demand_alert)

        # Save new alerts
        if alerts_generated:
            await self.db.alerts.insert_many(alerts_generated)

        return alerts_generated

    async def _check_low_stock(self, product):
        """Check if product has low stock"""
        current_stock = product.get('current_stock', 0)
        threshold = product.get('threshold', 10)

        # Check if alert already exists
        existing = await self.db.alerts.find_one({
            "product_id": str(product['_id']),
            "type": "low_stock",
            "resolved": False
        })

        if existing:
            return None

        if current_stock < threshold:
            severity = "critical" if current_stock < (threshold * 0.5) else "warning"
            message = f"Stock level {'critical' if severity == 'critical' else 'below threshold'}: {current_stock} units remaining"

            # Mock email/WhatsApp notification
            await self._send_alert_notification(product['name'], message, severity)

            return {
                "_id": str(uuid.uuid4()),
                "type": "low_stock",
                "product_id": str(product['_id']),
                "product_name": product['name'],
                "message": message,
                "timestamp": datetime.utcnow(),
                "severity": severity,
                "resolved": False
            }

        return None

    async def _check_demand_surge(self, product):
        """Check if forecasted demand exceeds current stock"""
        current_stock = product.get('current_stock', 0)
        
        # Get forecast for next 7 days
        forecasts = await self.db.forecasts.find({
            "product_id": str(product['_id'])
        }).limit(7).to_list(7)

        if not forecasts:
            return None

        predicted_demand = sum(f.get('predicted_sales', 0) for f in forecasts)

        # Check if alert already exists
        existing = await self.db.alerts.find_one({
            "product_id": str(product['_id']),
            "type": "demand_surge",
            "resolved": False
        })

        if existing:
            return None

        if predicted_demand > current_stock * 0.8:
            percentage = int(((predicted_demand - current_stock) / current_stock) * 100)
            message = f"Predicted demand surge in next 7 days: +{percentage}%"

            # Send informational notification for demand surge
            await self._send_alert_notification(product['name'], message, "info")

            return {
                "_id": str(uuid.uuid4()),
                "type": "demand_surge",
                "product_id": str(product['_id']),
                "product_name": product['name'],
                "message": message,
                "timestamp": datetime.utcnow(),
                "severity": "info",
                "resolved": False
            }

        return None

    async def _send_alert_notification(self, product_name: str, message: str, severity: str):
        """Send real WhatsApp and Email notifications"""
        alert_emoji = {
            'critical': '🚨',
            'warning': '⚠️',
            'info': 'ℹ️'
        }.get(severity, '📢')
        
        whatsapp_message = f"{alert_emoji} *SmartStock AI Alert*\n\n*Product:* {product_name}\n*Status:* {severity.upper()}\n\n{message}\n\n_Automated alert from SmartStock AI_"
        
        logger.info(f"[{severity.upper()}] ALERT for {product_name}: {message}")
        
        # Send WhatsApp
        if self.twilio_enabled:
            try:
                message_obj = self.twilio_client.messages.create(
                    from_=self.whatsapp_from,
                    body=whatsapp_message,
                    to=self.whatsapp_to
                )
                logger.info(f"✅ WhatsApp notification sent successfully (SID: {message_obj.sid})")
            except Exception as e:
                logger.error(f"❌ Failed to send WhatsApp: {str(e)}")
        
        # Send Email
        if self.email_enabled:
            try:
                self._send_email_alert(product_name, message, severity, alert_emoji)
                logger.info(f"✅ Email notification sent successfully to {self.mail_to}")
            except Exception as e:
                logger.error(f"❌ Failed to send Email: {str(e)}")
    
    def _send_email_alert(self, product_name: str, message: str, severity: str, emoji: str):
        """Send email alert using SMTP"""
        subject = f"{emoji} SmartStock AI - {severity.upper()} Alert: {product_name}"
        
        # Create HTML email
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h1 style="color: {'#FF3B30' if severity == 'critical' else '#FF9500' if severity == 'warning' else '#007AFF'};">
                        {emoji} SmartStock AI Alert
                    </h1>
                    <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">
                    
                    <h2 style="color: #333;">Product: {product_name}</h2>
                    <p style="font-size: 16px; color: #666; line-height: 1.6;">
                        <strong>Status:</strong> <span style="color: {'#FF3B30' if severity == 'critical' else '#FF9500' if severity == 'warning' else '#007AFF'}; font-weight: bold;">{severity.upper()}</span>
                    </p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 15px; color: #333;">{message}</p>
                    </div>
                    
                    <p style="color: #999; font-size: 13px; margin-top: 30px;">
                        This is an automated alert from SmartStock AI Inventory Management System.<br>
                        Timestamp: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
                    </p>
                </div>
            </body>
        </html>
        """
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = self.mail_from
        msg['To'] = self.mail_to
        
        # Attach HTML part
        html_part = MIMEText(html_body, 'html')
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(self.mail_server, self.mail_port) as server:
            server.starttls()
            server.login(self.mail_username, self.mail_password)
            server.send_message(msg)

    async def check_and_generate_alerts_for_product(self, product: dict):
        """Check a single product and generate alerts immediately.
        Saves new alerts and triggers notifications when applicable.
        """
        alerts_generated = []

        # Low stock / critical
        low_stock_alert = await self._check_low_stock(product)
        if low_stock_alert:
            alerts_generated.append(low_stock_alert)

        # Demand surge (info-level)
        demand_alert = await self._check_demand_surge(product)
        if demand_alert:
            alerts_generated.append(demand_alert)

        if alerts_generated:
            await self.db.alerts.insert_many(alerts_generated)

        return alerts_generated

    async def get_active_alerts(self, limit: int = 50):
        """Get all active alerts"""
        alerts = await self.db.alerts.find(
            {"resolved": False}
        ).sort("timestamp", -1).limit(limit).to_list(limit)
        
        return alerts

    async def resolve_alert(self, alert_id: str):
        """Mark an alert as resolved"""
        result = await self.db.alerts.update_one(
            {"_id": alert_id},
            {"$set": {"resolved": True}}
        )
        return result.modified_count > 0