# 🔍 Code Review Report

## Summary

| Metric | Value |
|--------|-------|
| **Overall Score** | 77/100 |
| **Files Reviewed** | 3 |
| **Critical Issues** | 2 |
| **High Priority Tests** | 1 |
| **Refactoring Opportunities** | 0 |

## 🎯 Top Recommendations

1. 🚨 **style**: Potential issue in kubernetes/stream/stream_test.py in kubernetes/stream/stream_test.py
   - Files: kubernetes/stream/stream_test.py

2. 🚨 **performance**: Potential issue in kubernetes/stream/ws_client_test.py in kubernetes/stream/ws_client_test.py
   - Files: kubernetes/stream/ws_client_test.py

3. ⚠️ **test-coverage**: Missing test for main handler in kubernetes/stream/stream_test.py
   - Files: kubernetes/stream/stream_test.py

## 📁 File Details

### 📄 `kubernetes/stream/stream_test.py`

**Quality Score:** 83/100 | **Coverage:** ~52%

#### Issues (1)
  - Line 66: `critical` Potential issue in kubernetes/stream/stream_test.py


#### Test Gaps (1)
  - `main handler` (high priority)


#### Refactoring Opportunities (0)
  None found


---

### 📄 `kubernetes/stream/ws_client.py`

**Quality Score:** 88/100 | **Coverage:** ~70%

#### Issues (2)
  - Line 33: `low` Potential issue in kubernetes/stream/ws_client.py
  - Line 51: `low` Potential issue in kubernetes/stream/ws_client.py


#### Test Gaps (0)
  None found


#### Refactoring Opportunities (0)
  None found


---

### 📄 `kubernetes/stream/ws_client_test.py`

**Quality Score:** 62/100 | **Coverage:** ~83%

#### Issues (1)
  - Line 65: `critical` Potential issue in kubernetes/stream/ws_client_test.py


#### Test Gaps (0)
  None found


#### Refactoring Opportunities (0)
  None found


---

*Generated at 2026-11-22T20:06:25.393Z • Duration: 0ms*
