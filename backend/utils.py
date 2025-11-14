from datetime import datetime
from typing import Dict, List

def calculate_product_status(current_stock: int, threshold: int) -> str:
    """Calculate product status based on stock levels"""
    if current_stock < threshold * 0.5:
        return "critical"
    elif current_stock < threshold:
        return "low_stock"
    else:
        return "in_stock"

def format_product_response(product: Dict) -> Dict:
    """Format product document for API response"""
    if product:
        product['id'] = str(product['_id'])
        product['_id'] = str(product['_id'])
        product['product_id'] = str(product.get('product_id', product['_id']))
        if 'last_updated' in product:
            product['last_updated'] = product['last_updated'].isoformat()
    return product

def format_sales_response(sales: List[Dict]) -> List[Dict]:
    """Format sales documents for API response"""
    formatted = []
    for sale in sales:
        sale['id'] = str(sale['_id'])
        sale['_id'] = str(sale['_id'])
        if 'product_id' in sale:
            sale['product_id'] = str(sale['product_id'])
        if 'date' in sale:
            sale['date'] = sale['date'].isoformat()
        formatted.append(sale)
    return formatted

def format_alert_response(alert: Dict) -> Dict:
    """Format alert document for API response"""
    if alert:
        alert['id'] = str(alert['_id'])
        alert['_id'] = str(alert['_id'])
        if 'product_id' in alert:
            alert['product_id'] = str(alert['product_id'])
        if 'timestamp' in alert:
            alert['timestamp'] = alert['timestamp'].isoformat()
    return alert