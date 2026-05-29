# HAQMS Internship Assignment Documentation

## Overview

This document summarizes the issues identified, fixes implemented, security findings, and engineering decisions made while working on the HAQMS application.

---

## Issues Identified

### 1. Doctor Dashboard Crash

**Issue:**
Opening certain patient records caused the application to crash.

**Root Cause:**
`medicalHistory.toUpperCase()` was called on a null value.

**Impact:**
Doctor dashboard became unusable for affected patients.

---

### 2. Missing Next.js Link Import

**Issue:**
Clicking patient details generated a runtime error.

**Root Cause:**
`Link` component was used without importing it.

**Impact:**
Navigation functionality failed.

---

### 3. React Hooks Order Violation

**Issue:**
React reported hook ordering errors.

**Root Cause:**
Hooks were conditionally executed.

**Impact:**
Unstable rendering and runtime warnings.

---

### 4. Null User Access

**Issue:**
Application crashed while reading `user.role`.

**Root Cause:**
User object was accessed before initialization.

**Impact:**
Dashboard rendering failure.

---

### 5. Queue Polling Memory Leak

**Issue:**
Queue page created background polling intervals without cleanup.

**Root Cause:**
Missing `clearInterval()` cleanup function.

**Impact:**
Multiple active intervals, memory growth, excessive API requests.

---

### 6. Queue Authentication Failure

**Issue:**
Queue API returned 401 Unauthorized.

**Root Cause:**
Frontend requested token using an incorrect localStorage key.

**Impact:**
Queue data failed to load.

---

## Fixes Implemented

### Dashboard Fixes

- Added null-safe handling for patient medical history.
- Fixed missing Link import.
- Corrected React hook usage.
- Added protection against null user access.

### Queue Fixes

- Added interval cleanup using `clearInterval()`.
- Corrected authentication token retrieval using `haqms_token`.

### Authentication Fixes

- Removed JWT expiration bypass by eliminating `ignoreExpiration: true`.
- Restored proper authorization middleware functionality.

---

## Security Findings

### SQL Injection Vulnerability

Location:
`backend/src/routes/doctors.js`

Evidence:
Doctor search endpoint directly interpolates user input into SQL queries and executes them using `prisma.$queryRawUnsafe()`.

Example Payload:

' OR '1'='1

Impact:
Potential unauthorized data access and database compromise.

Status:
Identified and documented.

---

### Hardcoded JWT Secret Fallback

Impact:
Weakens authentication security if environment configuration is incorrect.

Status:
Identified and documented.

---

### Detailed Error Leakage

Impact:
Internal implementation details exposed to clients.

Status:
Identified and documented.

---

## Remaining Known Issues

- SQL injection vulnerability remains present and should be fixed using parameterized queries.
- Additional security review recommended.
- Further performance optimization opportunities exist in database aggregation endpoints.

---

## Approach and Reasoning

Priority was given to issues that:

1. Prevented application functionality.
2. Caused application crashes.
3. Introduced security risks.
4. Created resource leaks or stability issues.

The debugging process focused on reproducing issues, identifying root causes, implementing minimal-risk fixes, and verifying functionality after each change.

## Deployment Challenges and Resolution

### Railway Deployment Failure

#### Initial Problem
The backend deployed successfully during the build phase but the public URL returned:

Application failed to respond

#### Investigation Process
Several potential causes were investigated:

- Environment variable issues
- Prisma database connectivity
- Route initialization failures
- Middleware startup crashes
- Port configuration issues

#### Runtime Debugging
Additional startup logs were added throughout the application initialization process.

This revealed a duplicate import declaration causing a runtime error:

Identifier 'express' has already been declared

The duplicate declaration was removed.

#### Port Configuration Issue
Further investigation revealed that Railway was configured with:

Target Port: 8080

while the application was listening on:

Port: 5000

As a result, Railway could not route traffic to the running backend service.

#### Resolution
The Railway target port was updated from:

8080 → 5000

The application was also verified to bind correctly using:

app.listen(PORT, '0.0.0.0')

#### Result
The backend became publicly accessible and returned the expected API response.

Deployment URL:
https://haqms-production-780f.up.railway.app/
