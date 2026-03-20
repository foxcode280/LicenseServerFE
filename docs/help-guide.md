# Help Guide

## Purpose

This document helps product users, administrators, QA teams, and developers understand how the License Server Manager behaves.

## Common Questions

### Why are there multiple status types?

Because one status is not enough for enterprise licensing.

- Subscription status tells us whether the business entitlement is valid.
- License status tells us whether the license artifact has been created, issued, activated, or ended.
- Activation status tells us whether a machine has been bound correctly.

### When can a license be generated?

A license can be generated only when the subscription lifecycle status is:

- `APPROVED`
- `ACTIVE`

### When can activation happen?

Activation can happen only when:

- the subscription is `ACTIVE`
- the license is not `EXPIRED`
- the license is not `REVOKED`

### What is the difference between `ISSUED` and `ACTIVE`?

- `ISSUED` means the license has been delivered.
- `ACTIVE` means the license has been validated and is currently enforceable.

### What is `ACTIVATION_PENDING`?

This means the license exists and may already be delivered, but machine binding is not complete yet.

This is especially important in offline licensing where:

1. a generic license is issued first
2. the machine request is uploaded later
3. final activation happens after fingerprint validation

### What is the grace period?

Grace period is a short configurable extension after license expiry. It allows limited continued use while renewal is being processed.

Example:

- license expiry date: `31 Dec`
- grace period: `7 days`
- grace ends: `7 Jan`

During grace:

- renewal may still be allowed
- the license is not yet fully expired

### What happens if a license is revoked?

Revocation overrides normal lifecycle progression.

If a license is revoked:

- activation should be blocked
- normal use should be blocked
- grace should not restore validity

### What happens if a subscription is expired?

If the subscription is expired:

- no new license generation should be allowed
- existing licenses may follow their own lifecycle and expiry rules based on policy

## Operator Guidance

### While Creating A Subscription

- select a valid company
- select the correct plan
- ensure total device allocation does not exceed the plan limit
- use `Custom` only when business rules require a manual duration/start date setup

### While Generating An Online License

- verify subscription is in an allowed state
- confirm device allocation exists
- confirm the subscription has remaining allocation capacity

### While Processing An Offline License

1. confirm subscription approval
2. generate generic license
3. wait for request file upload
4. verify fingerprint data
5. generate final activated license
6. deliver final `.lic` file for manual transfer

## Recommended UI Display Rules

- show human-friendly labels in the UI
- keep canonical enum values in code/database
- display subscription, license, and activation statuses separately where operational clarity matters
- use badges for current state and timelines for transition history

## Recommended Audit Events

These events should eventually be logged:

- subscription created
- subscription submitted
- subscription approved
- subscription suspended
- license generated
- license issued
- activation request received
- machine verified
- license activated
- grace started
- license expired
- license revoked

## Reference Files

- [Implementation Overview](D:/Kailash/Project/screenProApp/NewProject/licensemanagerFE-main/docs/license-server-manager-overview.md)
- [Workflow And Status Reference](D:/Kailash/Project/screenProApp/NewProject/licensemanagerFE-main/docs/workflow-and-status-reference.md)
- [Lifecycle Source File](D:/Kailash/Project/screenProApp/NewProject/licensemanagerFE-main/src/licensingLifecycle.ts)
