#!/usr/bin/env python3
"""
Test script for FWFPS Python Flask API endpoints
"""
import requests
import json
import time

BASE_URL = "http://127.0.0.1:5001"

def test_endpoint(endpoint, method="GET", data=None):
    """Test a single API endpoint"""
    try:
        url = f"{BASE_URL}{endpoint}"
        print(f"\n🔍 Testing {method} {url}")
        
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        print(f"✅ Status: {response.status_code}")
        if response.status_code == 200:
            try:
                json_data = response.json()
                print(f"📋 Response: {json.dumps(json_data, indent=2)}")
            except:
                print(f"📋 Response: {response.text}")
        else:
            print(f"❌ Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection Error: Server not running on {BASE_URL}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def main():
    print("🚀 FWFPS API Testing Started")
    print(f"📍 Base URL: {BASE_URL}")
    
    # Wait a moment for server to be ready
    time.sleep(2)
    
    # Test health endpoint
    test_endpoint("/api/health")
    
    # Test workplans endpoint
    test_endpoint("/api/workplans")
    
    # Test workplan dashboard
    test_endpoint("/api/workplans/dashboard")
    
    # Test PAC operations
    test_endpoint("/api/pac/operations")
    
    # Test user login
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    test_endpoint("/api/auth/login", "POST", login_data)
    
    print("\n✨ API Testing Complete!")

if __name__ == "__main__":
    main()
