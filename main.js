//array of objs key = iso code of country value = name of country
var countriesArray = [
   {"AR": "Argentina"},
   {"AW": "Aruba"},
   {"BO": "Bolivia"},
   {"CH": "Switzerland"},
   {"CU": "Cuba"},
   {"DO": "Dominica Republic"},
   {"GB-NIR": "Northern Ireland"},
   {"HR": "Croatia"},
   {"IN": "India"},
   {"JP": "Japan"},
   {"MG": "Madagascar"},
   {"MX": "Mexico"},
   {"NO": "Norway"},
   {"PL": "Poland"},
   {"RE": "Réunion"},
   {"SE": "Sweden"},
   {"SK": "Slovakia"},
   {"US": "United States"},
   {"ZW": "Zimbabwe"},
   {"AO": "Angola"},
   {"AX": "Âland Islands"},
   {"BR": "Brazil"},
   {"CN": "China"},
   {"CZ": "Czech Republic"},
   {"EC": "Ecuador"},
   {"FR": "France"},
   {"GB-SCT": "Scotland"},
   {"GT": "Guatemala"},
   {"HU": "Hungary"},
   {"IL": "Israel"},
   {"KZ": "Kazakhstan"},
   {"MQ": "Martinique"},
   {"MZ": "Mozambique"},
   {"PE": "Peru"},
   {"PR": "Puerto Rico"},
   {"RO": "Romania"},
   {"SG": "Singapore"},
   {"TN": "Tunisia"},
   {"UY": "Uruguay"},
   {"AT": "Austria"},
   {"BA": "Bosnia and Herzegovina"},
   {"BS": "The Bahamas"},
   {"CO": "Colombia"},
   {"DE": "Germany"},
   {"ES": "Spain"},
   {"GB": "United Kingdom"},
   {"GB-WLS": "Wales"},
   {"HK": "Hong Kong"},
   {"ID": "Indonesia"},
   {"IS": "Iceland"},
   {"LS": "Lesotho"},
   {"MT": "Malta"},
   {"NG": "Nigeria"},
   {"PK": "Pakistan"},
   {"PT": "Portugal"},
   {"RU": "Russia"},
   {"SI": "Slovenia"},
   {"TR": "Turkey"},
   {"VE": "Venezuela"},
   {"AU": "Australia"},
   {"BE": "Belgium"},
   {"BG": "Bulgaria"},
   {"CA": "Canada"},
   {"CR": "Costa Rica"},
   {"DK": "Denmark"},
   {"FI": "Finland"},
   {"GB-ENG": "England"},
   {"GR": "Greece"},
   {"HN": "Honduras"},
   {"IE": "Ireland"},
   {"IT": "Italy"},
   {"LU": "Luxemburg"},
   {"MU": "Mauritius"},
   {"NL": "Netherlands"},
   {"PH": "Philippines"},
   {"PY": "Paraguay"},
   {"SC": "Seychelles"},
   {"ST": "Sao Tome and Principe"},
   {"UA": "Ukraine"},
   {"ZA": "South Africa"},
]
// take year from span
var year = $('#year').text();
//take month from the attr inside the span month
var month = $('#month').attr('numMonth');
$(document).ready(function(){
   fillSelectCountry(countriesArray);
   //on button click search for the country holidays
   $('#searchBtn').click(function(){
      //take the country code from select
      var codeCountry = $('#country-select').val();
      $.ajax({
         url: 'https://holidayapi.com/v1/holidays',
         method: 'GET',
         data: {
            key: "d78dd42e-cba8-48c7-8d81-b427ef44442e",
            country: codeCountry,
            year: year,
            month: month
         },
         success: function(data){
            //take the array of holidays
            var festa = data.holidays;
            var daysInMonth = moment(year + '-' + month).daysInMonth();
            generateList(daysInMonth, festa);
         },
         error: function(){

         }
      });
   });
});
//Function to fill the select
function fillSelectCountry(arrCountries){
   var objKeys = [];
   var optNation = $('#country-select');
   for (var i = 0; i < arrCountries.length; i++) {
      objKeys.push(Object.keys(arrCountries[i]).toString());
   }
   //fill the select of countries
   for (var i = 0; i < arrCountries.length; i++) {
      optNation.append('<option value="' + objKeys[i] + '">' + arrCountries[i][objKeys[i]] + '</option>');
   }
}
//Function to create the list of days
function generateList(monthDays, holiday){
   var listCnt = $('#list-days');
   listCnt.children().remove();
   console.log(holiday);
   debugger;
   for (var i = 0; i < monthDays; i++) {
      if(i < 9){
         var StringDay = '0' + (i+1);
         var day = moment(year + '-' + month + '-' + StringDay);
      }
      else{
         day = moment(year + '-' + (i + 1) + '-' + month);
      }
      console.log(day);
      //check if the array of holiday is empty AND
      //check if we reached its length
      if(holiday.length != 0){
         var cont = 0;
         var isFound = false;
         do{
            //take the date from the array of holiday
            var dateFromArr = moment(holiday[cont].date);
            console.log(dateFromArr);
            //assign to a var the result if the dates are equal
            var isSame = moment(dateFromArr).isSame(day);
            console.log(isSame);
            if(isSame){
               listCnt.append('<div class="day-element color-red">' + (i + 1) + ' - ' + holiday[cont].name + ' </div>');
               isFound = true;
            }
            else{
               cont++;
            }
         }while((!isFound) && (cont < holiday.length));
         //check if date was found. If it wasn't append element normally
         if(!isFound){
            listCnt.append('<div class="day-element">' + (i + 1) + ' </div>');
         }
      }
      else{
         listCnt.append('<div class="day-element">' + (i + 1) + ' </div>');
      }
   }
}
