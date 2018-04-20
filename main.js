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
//take month from the data inside the span month
var month = $('#month').data('num_month');
//declaring variable to convert month in string
var parsedMonth;
//take the actual year to check
var actualYear = moment().format('YYYY');
//take the actual month
var actualMonth = moment().format('MM');
//actual month and year
var actualNow = moment(actualYear + '-' + actualMonth);
$(document).ready(function(){
   //hide previous and next
   $('.changeMonth').hide();
   $('#top-bar').css('justify-content', 'center');
   //fill the select with all the countries
   fillSelectCountry(countriesArray);
   //on button click search for the country holidays in January
   $('#searchBtn').click(function(){
      //after click make previous and next visible
      $('.changeMonth').show();
      $('#top-bar').css('justify-content', 'space-between');
      //take the country code from select
      var codeCountry = $('#country-select').val();
      //make an ajax call to retrieve all the holiday of the year and month by default
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
            console.log(data);
            //take the array of holidays
            var festa = data.holidays;
            //need to do this check because I can't take the daysInMonth
            //if I keep a single value the days method won't work
            if(month < 10){
               parsedMonth = '';
               parsedMonth = '0' + month;
               var daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
            }
            else{
               var daysInMonth = moment(year + '-' + month).daysInMonth();

            }
            //call a function to make a list of the day of the month appears
            generateList(daysInMonth, festa);
         },
         error: function(){
            alert('ERROR');
         }
      });
   });
   //When click on Successivo change month
   $('.changeMonth.forward').click(function(){
      //take the month incremented by one
      month = incrementMonth(month);
      if(month < 10){
         parsedMonth = '';
         parsedMonth = '0' + month;
         var daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         var yearMonth = moment(year + '-' + ('0' + month));
         $('#month').data('num_month', month);
         changeMonthName(month);
      }
      else if((month >= 10) && (month <= 12)){
         daysInMonth = moment(year + '-' + month).daysInMonth();
         yearMonth = moment(year + '-' + (month));
         $('#month').data('num_month', month);
         changeMonthName(month);
      }
      else{
         month = 1
         year++;
         daysInMonth = moment(year + '-' +('0' + month)).daysInMonth();
         yearMonth = moment(year + '-' + ('0' + month));
         changeMonthName(month);
         $('#year').text(year);
      }
      console.log(daysInMonth);
      console.log(yearMonth);
      //generate a boolean to see if the date on calendar is before today
      var isBefore = moment(yearMonth).isBefore(actualNow);
      if(isBefore){
         //take the code of the country
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
               if(month < 10){
                  parsedMonth = '';
                  parsedMonth = '0' + month;

                  var daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();

               }
               else{
                  daysInMonth = moment(year + '-' + month).daysInMonth();


               }
               generateList(daysInMonth, festa);
            },
            error: function(){
               alert('ERROR');
            }
         });
      }
      else{
         alert('You have to give me money to pay for the API, if you want to see the future');
         $('.forward').hide();
         $('#list-days').children().remove();
      }
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
   for (var i = 0; i < monthDays; i++) {
      if(i < 9){
         var StringDay = '0' + (i+1);
         var day = moment(year + '-' + parsedMonth + '-' + StringDay);
      }
      else{
         day = moment(year + '-' + (i + 1) + '-' + parsedMonth);
      }
      //check if the array of holiday is empty
      if(holiday.length != 0){
         var cont = 0;
         var isFound = false;
         //this loop check whether the holiday was found
         //inside the array of the API
         do{
            //take the date from the array of holiday
            var dateFromArr = moment(holiday[cont].date);
            //assign to a var the result if the dates are equal
            var isSame = moment(dateFromArr).isSame(day);
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
//Function to increment the month of 1
function incrementMonth(oldMonth){
   var newMonth = parseInt(oldMonth) + 1;
   return newMonth;
}
//function to change name to the month
function changeMonthName(mese){
   //take the value of the data of month
   var monthNum = $('#month').data('num_month');
   monthNum = mese;;
   var monthName = $('#month');
   switch(mese){
      case 1:
         monthName.text('Gennaio');
         break;
      case 2:
         monthName.text('Febbraio');
         break;
      case 3:
         monthName.text('Marzo');
         break;
      case 4:
         monthName.text('Aprile');
         break;
      case 5:
         monthName.text('Maggio');
         break;
      case 6:
         monthName.text('Giugno');
         break;
      case 7:
         monthName.text('Luglio');
         break;
      case 8:
         monthName.text('Agosto');
         break;
      case 9:
         monthName.text('Settembre');
         break;
      case 10:
         monthName.text('Ottobre');
         break;
      case 11:
         monthName.text('Novembre');
         break;
      case 12:
         monthName.text('Dicembre');
         break;
   }
}
