#!/usr/bin/env python3
"""
Quick Setup Verification Script
Checks all prerequisites and environment configuration before running RAG system
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

def check_python_version():
    """Verify Python version"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"  ✅ Python {version.major}.{version.minor} (required: 3.8+)")
        return True
    else:
        print(f"  ❌ Python {version.major}.{version.minor} (required: 3.8+)")
        return False

def check_dependencies():
    """Verify required packages are installed"""
    print("\n📦 Checking required packages...")
    required = ['upstash_vector', 'groq', 'dotenv', 'requests']
    missing = []
    
    for package in required:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} (not installed)")
            missing.append(package)
    
    if missing:
        print(f"\n  Run: pip install {' '.join(missing)}")
        return False
    return True

def check_environment_variables():
    """Verify environment variables are configured"""
    print("\n🔐 Checking environment variables...")
    load_dotenv()
    
    checks = {
        'Upstash URL': ['test_UPSTASH_VECTOR_REST_URL', 'UPSTASH_VECTOR_REST_URL'],
        'Upstash Token': ['test_UPSTASH_VECTOR_REST_TOKEN', 'UPSTASH_VECTOR_REST_TOKEN'],
        'Groq API Key': ['GROQ_API_KEY']
    }
    
    all_set = True
    for name, vars_to_check in checks.items():
        found = False
        for var in vars_to_check:
            if os.getenv(var):
                print(f"  ✅ {name} configured")
                found = True
                break
        if not found:
            print(f"  ❌ {name} not configured")
            all_set = False
    
    if not all_set:
        print("\n  Update your .env file with required credentials:")
        print("  - test_UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_URL")
        print("  - test_UPSTASH_VECTOR_REST_TOKEN or UPSTASH_VECTOR_REST_TOKEN")
        print("  - GROQ_API_KEY")
    
    return all_set

def check_profile_data():
    """Verify profile data file exists"""
    print("\n📄 Checking profile data...")
    profile_path = Path('data/digitaltwin.json')
    
    if profile_path.exists():
        size = profile_path.stat().st_size
        print(f"  ✅ data/digitaltwin.json ({size} bytes)")
        return True
    else:
        print(f"  ❌ data/digitaltwin.json not found")
        return False

def check_scripts():
    """Verify script files exist"""
    print("\n🐍 Checking script files...")
    scripts = [
        'embed_digitaltwin.py',
        'digital_twin_rag.py'
    ]
    
    all_exist = True
    for script in scripts:
        if Path(script).exists():
            print(f"  ✅ {script}")
        else:
            print(f"  ❌ {script} not found")
            all_exist = False
    
    return all_exist

def main():
    """Run all checks"""
    print("=" * 60)
    print("🤖 Digital Twin Setup Verification")
    print("=" * 60)
    
    results = {
        'Python Version': check_python_version(),
        'Dependencies': check_dependencies(),
        'Environment Variables': check_environment_variables(),
        'Profile Data': check_profile_data(),
        'Script Files': check_scripts()
    }
    
    print("\n" + "=" * 60)
    print("📊 Summary")
    print("=" * 60)
    
    for check, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {check}")
    
    print("\n" + "=" * 60)
    
    if all(results.values()):
        print("✅ All checks passed! Ready to proceed.\n")
        print("Next steps:")
        print("1. Load vectors: python embed_digitaltwin.py")
        print("2. Test RAG: python digital_twin_rag.py")
        return 0
    else:
        print("❌ Some checks failed. Fix issues above before proceeding.\n")
        return 1

if __name__ == '__main__':
    sys.exit(main())
