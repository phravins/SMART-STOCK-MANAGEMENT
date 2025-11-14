#!/usr/bin/env python3
"""
SmartStock AI Backend API Test Suite
Tests all backend endpoints for functionality and data integrity
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, List

# Backend URL from frontend/.env
BACKEND_URL = "http://127.0.0.1:8001"

class SmartStockAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        self.initial_prod_001_stock = None
        
    def log_test(self, test_name: str, success: bool, message: str, data: Any = None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'data': data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if not success and data:
            print(f"   Error details: {data}")
    
    def test_get_products(self) -> bool:
        """Test GET /api/products - Should return 15 products"""
        try:
            response = self.session.get(f"{BACKEND_URL}/products")
            
            if response.status_code != 200:
                self.log_test("GET /products", False, f"Expected 200, got {response.status_code}", response.text)
                return False
            
            products = response.json()
            
            if not isinstance(products, list):
                self.log_test("GET /products", False, "Response is not a list", products)
                return False
            
            product_count = len(products)
            expected_count = 15
            
            if product_count != expected_count:
                self.log_test("GET /products", False, f"Expected {expected_count} products, got {product_count}", {"count": product_count})
                return False
            
            # Validate product structure
            if products:
                product = products[0]
                required_fields = ['id', 'sku', 'name', 'category', 'current_stock', 'threshold', 'price', 'status']
                missing_fields = [field for field in required_fields if field not in product]
                
                if missing_fields:
                    self.log_test("GET /products", False, f"Missing required fields: {missing_fields}", product)
                    return False
            
            # Store PROD-001 initial stock for later comparison
            prod_001 = next((p for p in products if p['sku'] == 'PROD-001'), None)
            if prod_001:
                self.initial_prod_001_stock = prod_001['current_stock']
                self.log_test("GET /products", True, f"Found {product_count} products, PROD-001 stock: {self.initial_prod_001_stock}")
            else:
                self.log_test("GET /products", False, "PROD-001 not found in products", {"available_skus": [p['sku'] for p in products[:5]]})
                return False
            
            return True
            
        except Exception as e:
            self.log_test("GET /products", False, f"Exception occurred: {str(e)}", str(e))
            return False
    
    def test_dashboard_stats(self) -> bool:
        """Test GET /api/dashboard/stats - Should return statistics"""
        try:
            response = self.session.get(f"{BACKEND_URL}/dashboard/stats")
            
            if response.status_code != 200:
                self.log_test("GET /dashboard/stats", False, f"Expected 200, got {response.status_code}", response.text)
                return False
            
            stats = response.json()
            
            required_fields = ['total_products', 'low_stock_items', 'critical_items', 'total_value', 'monthly_sales', 'forecasted_sales', 'growth_rate']
            missing_fields = [field for field in required_fields if field not in stats]
            
            if missing_fields:
                self.log_test("GET /dashboard/stats", False, f"Missing required fields: {missing_fields}", stats)
                return False
            
            # Validate data types
            numeric_fields = ['total_products', 'low_stock_items', 'critical_items', 'total_value', 'monthly_sales', 'forecasted_sales', 'growth_rate']
            for field in numeric_fields:
                if not isinstance(stats[field], (int, float)):
                    self.log_test("GET /dashboard/stats", False, f"Field {field} should be numeric, got {type(stats[field])}", stats)
                    return False
            
            self.log_test("GET /dashboard/stats", True, f"Stats retrieved successfully: {stats['total_products']} products, ${stats['total_value']:.2f} total value")
            return True
            
        except Exception as e:
            self.log_test("GET /dashboard/stats", False, f"Exception occurred: {str(e)}", str(e))
            return False
    
    def test_dashboard_chart_data(self) -> bool:
        """Test GET /api/dashboard/chart-data - Should return chart data"""
        try:
            response = self.session.get(f"{BACKEND_URL}/dashboard/chart-data")
            
            if response.status_code != 200:
                self.log_test("GET /dashboard/chart-data", False, f"Expected 200, got {response.status_code}", response.text)
                return False
            
            chart_data = response.json()
            
            if not isinstance(chart_data, list):
                self.log_test("GET /dashboard/chart-data", False, "Chart data should be a list", chart_data)
                return False
            
            if len(chart_data) == 0:
                self.log_test("GET /dashboard/chart-data", False, "Chart data is empty", chart_data)
                return False
            
            # Validate chart data structure
            if chart_data:
                data_point = chart_data[0]
                required_fields = ['month', 'forecast']
                missing_fields = [field for field in required_fields if field not in data_point]
                
                if missing_fields:
                    self.log_test("GET /dashboard/chart-data", False, f"Missing required fields in chart data: {missing_fields}", data_point)
                    return False
            
            self.log_test("GET /dashboard/chart-data", True, f"Chart data retrieved successfully: {len(chart_data)} data points")
            return True
            
        except Exception as e:
            self.log_test("GET /dashboard/chart-data", False, f"Exception occurred: {str(e)}", str(e))
            return False
    
    def test_get_alerts(self) -> bool:
        """Test GET /api/alerts - Should return active alerts"""
        try:
            response = self.session.get(f"{BACKEND_URL}/alerts")
            
            if response.status_code != 200:
                self.log_test("GET /alerts", False, f"Expected 200, got {response.status_code}", response.text)
                return False
            
            alerts = response.json()
            
            if not isinstance(alerts, list):
                self.log_test("GET /alerts", False, "Alerts should be a list", alerts)
                return False
            
            # Validate alert structure if alerts exist
            if alerts:
                alert = alerts[0]
                required_fields = ['id', 'type', 'product_id', 'product_name', 'message', 'timestamp', 'severity', 'resolved']
                missing_fields = [field for field in required_fields if field not in alert]
                
                if missing_fields:
                    self.log_test("GET /alerts", False, f"Missing required fields in alert: {missing_fields}", alert)
                    return False
            
            self.log_test("GET /alerts", True, f"Alerts retrieved successfully: {len(alerts)} alerts")
            return True
            
        except Exception as e:
            self.log_test("GET /alerts", False, f"Exception occurred: {str(e)}", str(e))
            return False
    
    def test_stock_out_operation(self) -> bool:
        """Test POST /api/inventory/stock-out - Should decrease stock for PROD-001"""
        try:
            if self.initial_prod_001_stock is None:
                self.log_test("POST /inventory/stock-out", False, "Initial PROD-001 stock not available", None)
                return False
            
            stock_operation = {
                "sku": "PROD-001",
                "quantity": 2
            }
            
            response = self.session.post(f"{BACKEND_URL}/inventory/stock-out", json=stock_operation)
            
            if response.status_code != 200:
                self.log_test("POST /inventory/stock-out", False, f"Expected 200, got {response.status_code}", response.text)
                return False
            
            result = response.json()
            
            required_fields = ['message', 'new_stock', 'status']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                self.log_test("POST /inventory/stock-out", False, f"Missing required fields: {missing_fields}", result)
                return False
            
            expected_new_stock = self.initial_prod_001_stock - 2
            actual_new_stock = result['new_stock']
            
            if actual_new_stock != expected_new_stock:
                self.log_test("POST /inventory/stock-out", False, f"Expected new stock {expected_new_stock}, got {actual_new_stock}", result)
                return False
            
            self.log_test("POST /inventory/stock-out", True, f"Stock decreased from {self.initial_prod_001_stock} to {actual_new_stock}")
            return True
            
        except Exception as e:
            self.log_test("POST /inventory/stock-out", False, f"Exception occurred: {str(e)}", str(e))
            return False
    
    def test_verify_stock_decrease(self) -> bool:
        """Test GET /api/products again - Verify stock decreased for PROD-001"""
        try:
            response = self.session.get(f"{BACKEND_URL}/products")
            
            if response.status_code != 200:
                self.log_test("Verify stock decrease", False, f"Expected 200, got {response.status_code}", response.text)
                return False
            
            products = response.json()
            prod_001 = next((p for p in products if p['sku'] == 'PROD-001'), None)
            
            if not prod_001:
                self.log_test("Verify stock decrease", False, "PROD-001 not found after stock operation", None)
                return False
            
            current_stock = prod_001['current_stock']
            expected_stock = self.initial_prod_001_stock - 2
            
            if current_stock != expected_stock:
                self.log_test("Verify stock decrease", False, f"Expected stock {expected_stock}, got {current_stock}", prod_001)
                return False
            
            self.log_test("Verify stock decrease", True, f"PROD-001 stock correctly updated to {current_stock}")
            return True
            
        except Exception as e:
            self.log_test("Verify stock decrease", False, f"Exception occurred: {str(e)}", str(e))
            return False
    
    def test_contact_form(self) -> bool:
        """Test POST /api/contact - Submit contact form"""
        try:
            contact_data = {
                "name": "John Smith",
                "email": "john.smith@example.com",
                "company": "Tech Solutions Inc",
                "message": "I'm interested in learning more about SmartStock AI for our inventory management needs. Could you provide more information about pricing and implementation?"
            }
            
            response = self.session.post(f"{BACKEND_URL}/contact", json=contact_data)
            
            if response.status_code != 200:
                self.log_test("POST /contact", False, f"Expected 200, got {response.status_code}", response.text)
                return False
            
            result = response.json()
            
            if 'message' not in result:
                self.log_test("POST /contact", False, "Missing 'message' field in response", result)
                return False
            
            self.log_test("POST /contact", True, f"Contact form submitted successfully: {result['message']}")
            return True
            
        except Exception as e:
            self.log_test("POST /contact", False, f"Exception occurred: {str(e)}", str(e))
            return False
    
    def check_arima_forecasts(self) -> bool:
        """Check if ARIMA forecasts exist in database by testing forecast endpoint"""
        try:
            # Try to get forecast for PROD-001
            response = self.session.get(f"{BACKEND_URL}/forecast/PROD-001")
            
            if response.status_code == 404:
                self.log_test("ARIMA forecasts check", False, "No forecasts found for PROD-001", None)
                return False
            elif response.status_code != 200:
                self.log_test("ARIMA forecasts check", False, f"Unexpected status code {response.status_code}", response.text)
                return False
            
            forecasts = response.json()
            
            if not isinstance(forecasts, list):
                self.log_test("ARIMA forecasts check", False, "Forecasts should be a list", forecasts)
                return False
            
            if len(forecasts) == 0:
                self.log_test("ARIMA forecasts check", False, "No forecast data available", forecasts)
                return False
            
            # Validate forecast structure
            forecast = forecasts[0]
            required_fields = ['id', 'product_id', 'sku', 'forecast_date', 'predicted_sales', 'created_at']
            missing_fields = [field for field in required_fields if field not in forecast]
            
            if missing_fields:
                self.log_test("ARIMA forecasts check", False, f"Missing required fields in forecast: {missing_fields}", forecast)
                return False
            
            self.log_test("ARIMA forecasts check", True, f"Found {len(forecasts)} forecasts for PROD-001")
            return True
            
        except Exception as e:
            self.log_test("ARIMA forecasts check", False, f"Exception occurred: {str(e)}", str(e))
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting SmartStock AI Backend API Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        tests = [
            ("Products API", self.test_get_products),
            ("Dashboard Stats", self.test_dashboard_stats),
            ("Dashboard Chart Data", self.test_dashboard_chart_data),
            ("Alerts API", self.test_get_alerts),
            ("Stock Out Operation", self.test_stock_out_operation),
            ("Verify Stock Decrease", self.test_verify_stock_decrease),
            ("Contact Form", self.test_contact_form),
            ("ARIMA Forecasts", self.check_arima_forecasts)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n🧪 Running {test_name}...")
            if test_func():
                passed += 1
        
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend API is working correctly.")
        else:
            print(f"⚠️  {total - passed} tests failed. Check the details above.")
        
        return passed == total
    
    def get_summary(self):
        """Get test summary"""
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        summary = {
            'total_tests': total,
            'passed': passed,
            'failed': total - passed,
            'success_rate': (passed / total * 100) if total > 0 else 0,
            'results': self.test_results
        }
        
        return summary

def main():
    """Main test execution"""
    tester = SmartStockAPITester()
    success = tester.run_all_tests()
    
    # Print detailed summary
    summary = tester.get_summary()
    print(f"\n📈 Success Rate: {summary['success_rate']:.1f}%")
    
    # Print failed tests details
    failed_tests = [r for r in summary['results'] if not r['success']]
    if failed_tests:
        print("\n❌ Failed Tests Details:")
        for test in failed_tests:
            print(f"  - {test['test']}: {test['message']}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())