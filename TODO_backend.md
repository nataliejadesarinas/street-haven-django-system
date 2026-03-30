# Backend Province → City API

## Backend Implementation Plan

### Files to Update:
1. `busiwebapp/views.py` - Add `location_api()` view
2. `busiwebapp/urls.py` - Add `/api/locations/` endpoint  
3. `static/js/gg.js` - Replace CITY_DATA const → async fetch
4. `static/data/ph_locations.json` - Full PH data source (optional)

### Steps:
1. ✅ Create plan
2. Create full PH locations JSON
3. Add Django view returning JSON
4. Add URL pattern
5. Update JS to fetch dynamically
6. Test API endpoint
7. Update modals to use API

**Status: 5/7 ✅**

