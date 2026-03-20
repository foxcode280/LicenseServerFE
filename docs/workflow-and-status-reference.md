# Workflow And Status Reference

## 1. Unified Licensing Model

The licensing system is divided into three layers:

1. Subscription
2. License
3. Activation

This model prevents business-state confusion. A subscription may be active while a license is still waiting for issuance or activation.

## 2. Subscription Lifecycle

Flow:

`DRAFT -> PENDING_APPROVAL -> APPROVED -> ACTIVE -> SUSPENDED -> EXPIRED -> CANCELLED`

### Status Descriptions

`DRAFT`

- subscription created but not finalized
- record is editable
- license generation is not allowed

`PENDING_APPROVAL`

- request submitted for approval
- preview is allowed
- license generation is disabled

`APPROVED`

- business approval completed
- device allocation is considered finalized
- license generation is allowed

`ACTIVE`

- subscription is valid and in force
- license generation and activation are allowed based on policy

`SUSPENDED`

- temporarily blocked by administrator
- new issuance and activation should be blocked

`EXPIRED`

- subscription duration completed
- new license generation is blocked

`CANCELLED`

- permanently closed by administrator or business action
- subscription is terminal

## 3. License Lifecycle

Flow:

`DRAFT -> GENERATED -> ISSUED -> ACTIVATION_PENDING -> ACTIVE -> GRACE -> EXPIRED -> REVOKED`

### Status Descriptions

`DRAFT`

- preview stage only
- not yet committed as a production artifact

`GENERATED`

- license created in system
- stored in database
- not yet delivered to customer

`ISSUED`

- shared with customer by email, portal, or manual transfer

`ACTIVATION_PENDING`

- waiting for machine binding or machine-side completion
- commonly used for offline licensing

`ACTIVE`

- successfully activated and enforceable

`GRACE`

- temporary post-expiry allowance
- renewal is still allowed during this window

`EXPIRED`

- validity window completed
- activation and normal use should be blocked

`REVOKED`

- manually disabled by administrator
- override state

## 4. Activation Lifecycle

Flow:

`NOT_BOUND -> REQUEST_RECEIVED -> VERIFIED -> ACTIVATED -> MISMATCH -> BLOCKED`

### Status Descriptions

`NOT_BOUND`

- no machine fingerprint attached yet

`REQUEST_RECEIVED`

- activation request received from machine or imported request file

`VERIFIED`

- machine fingerprint validated successfully

`ACTIVATED`

- binding completed successfully

`MISMATCH`

- machine details do not match expected fingerprint or binding record

`BLOCKED`

- activation denied due to policy, mismatch, revocation, or admin action

## 5. Business Rules

### License Generation Rules

- allowed only when subscription status is `APPROVED` or `ACTIVE`
- blocked when subscription is `DRAFT`, `PENDING_APPROVAL`, `SUSPENDED`, `EXPIRED`, or `CANCELLED`

### Activation Rules

- activation allowed only when subscription is `ACTIVE`
- expired license must not activate
- revoked license must not activate

### Grace Rules

- `ACTIVE -> GRACE -> EXPIRED`
- grace window is configurable
- example:
  - expiry date: `31 Dec`
  - grace period: `7 days`
  - final expiry: `7 Jan`

### Revocation Rules

- `ACTIVE -> REVOKED`
- `GRACE -> REVOKED`
- `ACTIVATION_PENDING -> REVOKED`

Revocation is an override rule and should take priority over normal expiry logic.

## 6. Online Workflow

1. Create subscription
2. Submit for approval
3. Approve subscription
4. Activate subscription
5. Generate license
6. Issue license
7. Validate using online API
8. Set activation to `ACTIVATED`
9. Set license to `ACTIVE`

## 7. Offline Workflow

1. Create company context
2. Create subscription
3. Approve subscription
4. Allocate devices
5. Preview license payload
6. Generate license
7. Issue generic `.lic`
8. Set license to `ACTIVATION_PENDING`
9. Receive fingerprint request
10. Set activation to `REQUEST_RECEIVED`
11. Verify machine details
12. Set activation to `VERIFIED`
13. Activate final license
14. Set activation to `ACTIVATED`
15. Set license to `ACTIVE`

## 8. Recommended Database Model

Store the following enums as explicit status fields:

- `subscription_status_enum`
- `license_status_enum`
- `activation_status_enum`

Recommended columns:

- `subscriptions.workflow_status`
- `licenses.workflow_status`
- `licenses.activation_status`
- `offline_activation_requests.activation_status`

## 9. Current Source Of Truth

Canonical status values and rules are defined in:

- [licensingLifecycle.ts](D:/Kailash/Project/screenProApp/NewProject/licensemanagerFE-main/src/licensingLifecycle.ts)
