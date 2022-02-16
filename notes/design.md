# React Big Calendar

## Types

1. Always save dates as Date objects in Mongoose
   1. Store all times in GMT time (ie ISOString). UI will show localized time instead ie PST/PDT.
2. [Redux] Store strings, primitives, and simple objects only (NO DATE OBJECTS)
3. [Frontend] Prefer using strings to represent dates (ie Redux and Localstorage); Convert to Date objects only as needed (ie props that require Date objects like RBC)
