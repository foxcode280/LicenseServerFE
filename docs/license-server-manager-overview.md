# License Server Manager

## Purpose

License Server Manager is designed to manage the full lifecycle of enterprise software licensing across:

- subscription management
- online license generation
- offline license generation and activation
- machine binding and activation validation
- administrative approval and control

The current implementation follows a layered licensing model aligned with common enterprise licensing practice:

1. Subscription lifecycle
2. License lifecycle
3. Activation lifecycle

This separation is important because:

- a subscription represents the commercial entitlement
- a license represents the technical entitlement artifact
- activation represents the machine-binding and enforcement step

## Core Design Principles

The implementation is structured around the following industry-standard principles:

- entitlement and activation are separate concerns
- subscription approval controls license generation
- activation is tracked independently from issuance
- offline activation uses a fingerprint-based binding workflow
- revoked states override normal validity
- expiry and grace are controlled by policy
- machine binding is explicit and auditable

## What Has Been Implemented

The frontend currently implements the following product areas:

- dashboard and master views
- company directory
- subscription plans
- subscription creation and approval flow
- online license generation flow
- offline license management flow
- system users
- device types
- shared licensing lifecycle definitions

## Architecture Model

### 1. Subscription Lifecycle

Subscription is the business contract layer. It decides whether license generation is allowed.

Recommended canonical statuses stored in code:

- `DRAFT`
- `PENDING_APPROVAL`
- `APPROVED`
- `ACTIVE`
- `SUSPENDED`
- `EXPIRED`
- `CANCELLED`

### 2. License Lifecycle

License is the entitlement artifact layer. It tracks whether a license has been created, issued, activated, or ended.

Recommended canonical statuses stored in code:

- `DRAFT`
- `GENERATED`
- `ISSUED`
- `ACTIVATION_PENDING`
- `ACTIVE`
- `GRACE`
- `EXPIRED`
- `REVOKED`

### 3. Activation Lifecycle

Activation is the machine-binding layer. It tracks the state of machine verification.

Recommended canonical statuses stored in code:

- `NOT_BOUND`
- `REQUEST_RECEIVED`
- `VERIFIED`
- `ACTIVATED`
- `MISMATCH`
- `BLOCKED`

## Implementation Location

The canonical lifecycle model is stored in:

- [licensingLifecycle.ts](D:/Kailash/Project/screenProApp/NewProject/licensemanagerFE-main/src/licensingLifecycle.ts)

The lifecycle metadata is attached to records through:

- [types.ts](D:/Kailash/Project/screenProApp/NewProject/licensemanagerFE-main/src/types.ts)

Mock lifecycle examples and seeded workflow records are available in:

- [constants.ts](D:/Kailash/Project/screenProApp/NewProject/licensemanagerFE-main/src/constants.ts)

Offline lifecycle transitions are currently simulated in:

- [offlineLicenseService.ts](D:/Kailash/Project/screenProApp/NewProject/licensemanagerFE-main/src/services/offlineLicenseService.ts)

## Enterprise Rules Implemented

The current model supports these core rules:

- license generation allowed only when subscription is `APPROVED` or `ACTIVE`
- activation allowed only when subscription is `ACTIVE`
- offline license remains `ACTIVATION_PENDING` until machine binding is completed
- online license may move directly to `ACTIVE` after successful validation
- grace is controlled through configurable policy
- revoked licenses override standard active/grace behavior
- expired subscription blocks new license generation
- expired license blocks activation

## Online Workflow Summary

1. Create subscription
2. Move subscription to `PENDING_APPROVAL`
3. Approve subscription
4. Move subscription to `APPROVED`
5. Activate subscription
6. Move subscription to `ACTIVE`
7. Generate license
8. Move license to `GENERATED`
9. Issue license
10. Move license to `ISSUED`
11. Validate through online API
12. Move activation to `ACTIVATED`
13. Move license to `ACTIVE`

## Offline Workflow Summary

1. Create company and user context
2. Create subscription
3. Approve subscription
4. Finalize device allocation
5. Preview license payload
6. Generate offline license
7. Issue generic `.lic`
8. Move license to `ACTIVATION_PENDING`
9. Receive machine fingerprint request
10. Validate request
11. Bind license to machine
12. Activate final license
13. Move activation to `ACTIVATED`
14. Move license to `ACTIVE`

## Future Implementation Guidance

For backend alignment, these lifecycle values should be stored in the database as enums or constrained string columns:

- subscription status enum
- license status enum
- activation status enum

Recommended persistence design:

- `subscriptions.workflow_status`
- `licenses.workflow_status`
- `licenses.activation_status`
- `offline_activation_requests.activation_status`

## Notes

The current UI still carries some older display labels for backward compatibility in mock screens. The canonical enterprise lifecycle should be treated as the source of truth for future backend and UI refactoring.
