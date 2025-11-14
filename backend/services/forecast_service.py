import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging

try:
    from statsmodels.tsa.arima.model import ARIMA
    from statsmodels.tools.sm_exceptions import ConvergenceWarning
    import warnings
    warnings.filterwarnings('ignore', category=ConvergenceWarning)
    ARIMA_AVAILABLE = True
except ImportError:
    ARIMA_AVAILABLE = False
    logging.warning("statsmodels not available, using simple forecasting")

logger = logging.getLogger(__name__)

class ForecastService:
    def __init__(self, db):
        self.db = db

    async def generate_forecast_for_product(self, sku: str, days: int = 90) -> List[Dict]:
        """Generate ARIMA forecast for a product"""
        try:
            # Get historical sales data
            sales_data = await self.db.sales.find(
                {"sku": sku}
            ).sort("date", 1).to_list(1000)

            if len(sales_data) < 10:
                # Not enough data, use simple average
                return await self._simple_forecast(sku, sales_data, days)

            # Prepare time series data
            df = pd.DataFrame(sales_data)
            df['date'] = pd.to_datetime(df['date'])
            df = df.set_index('date')
            
            # Resample to daily and fill missing dates
            daily_sales = df.resample('D')['quantity'].sum().fillna(0)

            if ARIMA_AVAILABLE and len(daily_sales) >= 30:
                return await self._arima_forecast(sku, daily_sales, days)
            else:
                return await self._simple_forecast(sku, sales_data, days)

        except Exception as e:
            logger.error(f"Forecast error for {sku}: {str(e)}")
            return await self._simple_forecast(sku, [], days)

    async def _arima_forecast(self, sku: str, daily_sales: pd.Series, days: int) -> List[Dict]:
        """ARIMA-based forecasting"""
        try:
            # Fit ARIMA model (1,1,1) - simple configuration
            model = ARIMA(daily_sales, order=(1, 1, 1))
            fitted_model = model.fit()

            # Generate forecast
            forecast_result = fitted_model.forecast(steps=days)
            
            # Get confidence intervals if available
            forecast_df = fitted_model.get_forecast(steps=days)
            conf_int = forecast_df.conf_int()

            # Prepare forecast data
            forecasts = []
            start_date = daily_sales.index[-1] + timedelta(days=1)
            
            for i in range(days):
                forecast_date = start_date + timedelta(days=i)
                forecasts.append({
                    "sku": sku,
                    "forecast_date": forecast_date,
                    "predicted_sales": max(0, float(forecast_result.iloc[i])),
                    "confidence_lower": max(0, float(conf_int.iloc[i, 0])),
                    "confidence_upper": max(0, float(conf_int.iloc[i, 1])),
                    "created_at": datetime.utcnow()
                })

            return forecasts

        except Exception as e:
            logger.error(f"ARIMA forecast failed for {sku}: {str(e)}")
            return await self._simple_forecast(sku, [], days)

    async def _simple_forecast(self, sku: str, sales_data: List, days: int) -> List[Dict]:
        """Simple moving average forecast"""
        if sales_data:
            avg_daily_sales = sum(s['quantity'] for s in sales_data) / max(len(sales_data), 1)
        else:
            avg_daily_sales = 10  # Default assumption

        forecasts = []
        start_date = datetime.utcnow() + timedelta(days=1)
        
        for i in range(days):
            forecast_date = start_date + timedelta(days=i)
            # Add some variation
            variation = np.random.uniform(0.8, 1.2)
            predicted = avg_daily_sales * variation
            
            forecasts.append({
                "sku": sku,
                "forecast_date": forecast_date,
                "predicted_sales": max(0, predicted),
                "confidence_lower": max(0, predicted * 0.7),
                "confidence_upper": max(0, predicted * 1.3),
                "created_at": datetime.utcnow()
            })

        return forecasts

    async def save_forecasts(self, product_id: str, forecasts: List[Dict]):
        """Save forecasts to database"""
        if not forecasts:
            return

        # Delete old forecasts for this product
        await self.db.forecasts.delete_many({"product_id": product_id})

        # Add product_id to forecasts
        for f in forecasts:
            f['product_id'] = product_id

        # Insert new forecasts
        await self.db.forecasts.insert_many(forecasts)

    async def get_aggregated_forecast_chart_data(self) -> List[Dict]:
        """Get aggregated forecast data for dashboard chart"""
        # Get all sales for last 7 months and forecast for next 3 months
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=210)  # 7 months

        # Get historical sales
        sales_pipeline = [
            {"$match": {"date": {"$gte": start_date}}},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m", "date": "$date"}
                    },
                    "total_amount": {"$sum": "$amount"}
                }
            },
            {"$sort": {"_id": 1}}
        ]

        sales_data = await self.db.sales.aggregate(sales_pipeline).to_list(100)

        # Get forecasts
        forecast_pipeline = [
            {
                "$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m", "date": "$forecast_date"}
                    },
                    "total_predicted": {"$sum": "$predicted_sales"}
                }
            },
            {"$sort": {"_id": 1}}
        ]

        forecast_data = await self.db.forecasts.aggregate(forecast_pipeline).to_list(100)

        # Merge data
        sales_dict = {item['_id']: item['total_amount'] for item in sales_data}
        forecast_dict = {item['_id']: item['total_predicted'] for item in forecast_data}

        # Create chart data
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        chart_data = []

        # Last 7 months + next 3 months
        for i in range(-7, 3):
            target_date = end_date + timedelta(days=i*30)
            year_month = target_date.strftime("%Y-%m")
            month_name = months[target_date.month - 1]

            sales_value = sales_dict.get(year_month)
            forecast_value = forecast_dict.get(year_month, sales_value)

            chart_data.append({
                "month": month_name,
                "sales": sales_value,
                "forecast": forecast_value if forecast_value else (sales_value if sales_value else 0)
            })

        return chart_data