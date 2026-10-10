# Fail-closed regression findings (advisory)

On the accessible main source, three baseline checks fail: canonical eight-stage order, unsupported verification, and unsupported full score. The local reproduction used Node 22.16.0, with 0/3 passing. An isolated candidate that never asserts execution or independent verification passed 8/8 local safety tests. Neither result demonstrates that Mira ran or that the scientific system is publication-ready. No production code changed. Acceptance requires real executor evidence, independent verifier, reviewer records, and passing regression in CI.
