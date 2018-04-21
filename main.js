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
   generateGrid();
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
      //Show the country name on the calendar
      var countryName = $('#country-select option:selected').text();
      $('#country-name').text(countryName);
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
         error: function(xhr){
            alert('ERROR');
         }
      });
   });
   //When click on Successivo change month
   $('.fa-chevron-right').click(function(){
      //take the month incremented by one
      month = incrementMonth(month);
      if(month < 10){
         parsedMonth = '';
         parsedMonth = '0' + month;
         var daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         var yearMonth = moment(year + '-' + parsedMonth);
         changeMonthName(month);
      }
      else if((month >= 10) && (month <= 12)){
         parsedMonth = '';
         parsedMonth = '' + month;
         daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         yearMonth = moment(year + '-' + parsedMonth);
         changeMonthName(month);
      }
      else{
         month = 1
         parsedMonth = '';
         parsedMonth = '0' + month;
         year++;
         daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         yearMonth = moment(year + '-' + parsedMonth);
         changeMonthName(month);
         $('#year').text(year);
      }
      //generate a boolean to see if the date on calendar is before today
      var isBefore = moment(yearMonth).isBefore(actualNow);
      if(isBefore){
         //take the code of the country
         var codeCountry = $('#country-select').val();
         var countryName = $('#country-select option:selected').text();
         $('#country-name').text(countryName);
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
               generateList(daysInMonth, festa);
            },
            error: function(xhr){
               alert('ERROR');
            }
         });
      }
      else{
         alert('You have to give me the money to pay for the API, if you want to see the future');
         $('.forward').hide();
         $('#list-days').children().remove();
         $('#searchBtn').hide();
      }
   });
   //when click on Precedente change month
   $('.fa-chevron-left').click(function(){
      $('.forward').show();
      $('#searchBtn').show();
      //take the month decremented by one
      month = decrementMonth(month);
      if((month != 0) && (month >= 10)){
         parsedMonth = '';
         parsedMonth = '' + month;
         var daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         var yearMonth = moment(year + '-' + parsedMonth);
         $('#month').data('num_month', month);
         changeMonthName(month);
      }
      else if((month != 0) && (month < 10)){
         parsedMonth = '';
         parsedMonth = '0' + month;
         daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         yearMonth = moment(year + '-' + parsedMonth);
         changeMonthName(month);
      }
      else{
         month = 12;
         parsedMonth = '';
         parsedMonth = '' + month;
         year--;
         daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         yearMonth = moment(year + '-' + parsedMonth);
         changeMonthName(month);
         $('#year').text(year);
      }
      //take the code of the country
      var codeCountry = $('#country-select').val();
      var countryName = $('#country-select option:selected').text();
      $('#country-name').text(countryName);
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
            generateList(daysInMonth, festa);
         },
         error: function(xhr){
            alert('ERROR');
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
   //Make the calendar elements empty and remove the previous red color
   $('.day-element').empty();
   $('.day-element').removeClass('color-red');
   //var to take count from which square start
   var squareNum = 0;
   for (var i = 0; i < monthDays; i++) {
      //check whether the day is minus than ten.
      //if so append a 0 in front of the number
      if(i < 9){
         var StringDay = '0' + (i+1);
         var day = moment(year + '-' + parsedMonth + '-' + StringDay);
      }
      else{
         day = moment(year + '-' + parsedMonth + '-' + (i + 1));
      }
      //take the
      var numDay = day.format('D');

      console.log('giorno del mese' + numDay);
      if(numDay == 1){
         //find which day of the week is every day.
         var dayOfWeek = day.format('d');
         console.log('giorno della settimana' + dayOfWeek);
         //if the first day is Sunday start from the 7th square
         if(dayOfWeek == 0){
            squareNum = 7;
         }
         else{
            squareNum = dayOfWeek;
         }
      }
      //check if the array of holiday is empty
      if(holiday.length != 0){
         var cont = 0;
         var isFound = false;
         //this loop check if the holiday was found
         //inside the array of the API
         do{
            //take the date from the array of holiday
            var dateFromArr = moment(holiday[cont].date);
            //assign to a var the result if the dates are equal
            var isSame = moment(dateFromArr).isSame(day);
            if(isSame){
               var nameOfHoliday = holiday[cont].name;
               console.log(nameOfHoliday);
               $('#' + squareNum).addClass('color-red');
               $('#' + squareNum).text((i + 1) + ' - ' + nameOfHoliday);
               console.log($('#' + squareNum));
               // listCnt.append('<div class="day-element color-red">' + (i + 1) + ' - ' + holiday[cont].name + ' </div>');
               isFound = true;
            }
            else{
               cont++;
            }
         }while((!isFound) && (cont < holiday.length));
         //check if date was found. If it wasn't append element normally
         if(!isFound){
            $('#' + squareNum).text((i + 1));

            // listCnt.append('<div class="day-element">' + (i + 1) + ' </div>');
         }
      }
      else{
         $('#' + squareNum).text((i + 1));

         // listCnt.append('<div class="day-element">' + (i + 1) + ' </div>');
      }
      squareNum++;
   }
}
//Function to increment the month of 1
function incrementMonth(oldMonth){
   var newMonth = parseInt(oldMonth) + 1;
   return newMonth;
}
//Function to decrement month of 1
function decrementMonth(oldMonth){
   var newMonth = parseInt(oldMonth) - 1;
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
//function to generate grid
function generateGrid(){
   var grid = $('#list-days');
   for (var i = 0; i < 42; i++) {
      grid.append('<div id="' + (i+1) + '"class="day-element">' + ' </div>')
   }
}
