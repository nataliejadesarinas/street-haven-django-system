# Street.Haven Register Modal Fix: Province → City Dropdown
Minimal frontend-only implementation

## Plan Summary
- Change city input → select dropdown
- JS: populate cities based on province selection  
- Minimal hardcoded data (3-5 cities/province)
- Update both modal templates for consistency

## Steps to Complete

### 1. ✅ Plan created & approved
### 2. ✅ Update `templates/base.html` 
   - Convert `#signupCityMun` input → empty select
### 3. ✅ Update `static/js/gg.js`
   - Add CITY_DATA object  
   - Add updateCities() function
   - Attach to province onchange
### 4. ✅ Update `static/js/gg.js`
   - Fixed city dropdown init for both modal templates (init on modal open)
### 5. Update `busiwebapp/templates/busiwebapp/_login_modal.html`
   - Added matching address section
### 3. Update `static/js/gg.js`
   - Add cityData object  
   - Add updateCities() function
   - Attach to province onchange
### 4. Update `busiwebapp/templates/busiwebapp/_login_modal.html`
   - Add full address section matching base.html
### 5. Test modal
   - Open register → select province → verify cities populate
   - Submit → check console formData.cityMun
### 6. Complete & demo

**Status: 1/6 done**

