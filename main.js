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
//declaring variable to store the days in the month;
var daysInMonth;
//varible to store the code of the country
var codeCountry;
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

   //on button click search for the country holidays in January (at the very beginning)
   $('#searchBtn').click(function(){
      //take the countries code from select
      codeCountry = $('#country-select').val();
      //If I press button without choosing a country I can't go ahead
      if(codeCountry == 'placeholder'){
         alert('scegli un paese');
      }
      else{
         //after click make previous and next visible
         $('.changeMonth').show();
         //adjust the layout of the top bar
         $('#top-bar').css('justify-content', 'space-between');
         //Show the country name on the calendar
         var countryName = $('#country-select option:selected').text();
         $('#country-name').text(countryName);
         //convert the month into a string;
         parsedMonth = convertMonth(month);
         //take the day inside the month
         daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         //generate the list of days inside month and take the first square
         //where the month starts
         var begin = generateList(daysInMonth);
         //make an ajax call to retrieve all the holidays in the month
         findHolidays(daysInMonth, begin);
      }
   });
   //When click on Successivo change month
   $('.fa-chevron-right').click(function(){
      //take the month incremented by one
      month = incrementMonth(month);
      if(month > 12){
         month = 1;
         year++;
         $('#year').text(year);
      }
      //convert month into a string
      parsedMonth = convertMonth(month);
      //change name to the actual month
      changeMonthName(month);
      var yearMonth = moment(year + '-' + parsedMonth);
      var isBefore = moment(yearMonth).isBefore(actualNow);
      if(isBefore){
         //take the day inside the month
         daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
         //generate the list of days inside month and take the first square
         //where the month starts
         var begin = generateList(daysInMonth);
         //make an ajax call to retrieve all the holidays in the month
         findHolidays(daysInMonth, begin);
      }
      else{
         alert('You have to give me the money to pay for the API, if you want to see the future');
         $('.forward').hide();
         $('.day-element').children().text('');
         $('#searchBtn').hide();
      }
   });
   //when click on Precedente change month
   $('.fa-chevron-left').click(function(){
      $('.forward').show();
      $('#searchBtn').show();
      //take the month decremented by one
      month = decrementMonth(month);
      if(month == 0){
         month = 12;
         year--;
         $('#year').text(year);
      }
      //convert month into a string
      parsedMonth = convertMonth(month);
      //change name to the actual month
      changeMonthName(month);
      //take the day inside the month
      daysInMonth = moment(year + '-' + parsedMonth).daysInMonth();
      //generate the list of days inside month and take the first square
      //where the month starts
      var begin = generateList(daysInMonth);
      //make an ajax call to retrieve all the holidays in the month
      findHolidays(daysInMonth, begin);
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

//function to convert the month into a String
function convertMonth(mese){
   var convertedMonth = '';
   if(mese < 10){
      convertedMonth = '0' + mese;
   }
   else{
      convertedMonth = '' + mese;;
   }
   return convertedMonth;
}

//function to return the date depend the day
function generateDate(dayToCheck){
   var StringDay = '';
   var day;
   if(dayToCheck <= 9){
      StringDay = '0' + dayToCheck;
      day = moment(year + '-' + parsedMonth + '-' + StringDay);
   }
   else{
      StringDay = '' + dayToCheck;
      day = moment(year + '-' + parsedMonth + '-' + StringDay);
   }
   return day;
}

//function to generate the list of the days in the month
function generateList(monthDays){
   //Make the calendar elements empty and remove the previous red color
   var dayElement = $('.day-element');
   dayElement.children().empty();
   dayElement.removeClass('color-red');
   //var to take count from which square start
   var squareNum = 0;
   //variable to return to know at which square my month starts
   var squareToStart = 0;
   for (var i = 0; i < monthDays; i++) {
      var day = generateDate(i + 1);
      //take the number of day
      var numDay = day.format('D');
      if(numDay == 1){
         //find which day of the week is every day.
         var dayOfWeek = day.format('d');
         //if the first day is Sunday start from the 7th square
         if(dayOfWeek == 0){
            squareNum = 7;
            squareToStart = 7;
         }
         else{
            squareNum = dayOfWeek;
            squareToStart = dayOfWeek;
         }
      }
      //assign to a variable the number of square
      var numbSquare = $('#' + squareNum);
      numbSquare.children('.number_month').text(i + 1);
      squareNum++;
   }
   return squareToStart;
}

// find which element is an holiday and make it red
function findHolidays(monthDays, start){
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
         // take the array of holidays
         var festa = data.holidays;
         for (var i = 0; i < monthDays; i++) {
            //set the first element of the calendar where I want to start
            var numbSquare = $('#' + start);
            //generate the day for every day of the month;
            var day = generateDate(i + 1);
            //check if the array of holiday is empty
            if(festa.length != 0){
               var cont = 0;
               var isFound = false;
               //this loop check if the holiday was found
               //inside the array of the API
               do{
                  //take the date from the array of holiday
                  var dateFromArr = moment(festa[cont].date);
                  //assign to a var the result if the dates are equal
                  var isSame = moment(dateFromArr).isSame(day);
                  if(isSame){
                     var nameOfHoliday = festa[cont].name;
                     numbSquare.addClass('color-red');
                     numbSquare.children('.number_month').text(i + 1);
                     numbSquare.children('.holiday_name').text(nameOfHoliday);
                     isFound = true;
                  }
                  else{
                     cont++;
                  }
               }while((!isFound) && (cont < festa.length));
               //check if date was found. If it wasn't append element normally
               if(!isFound){
                  numbSquare.children('.number_month').text(i + 1);
               }
            }
            else{
               numbSquare.children('.number_month').text(i + 1);
            }
            start++;
         }
      },
      error: function(xhr){
         alert('ERROR');
      }
   });
}

//Function to increment the month of 1
function incrementMonth(oldMonth){
   var newMonth = oldMonth + 1;
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
      grid.append('<div id="' + (i+1) + '"class="day-element">' +
                  '<span class="number_month">' + '</span>' +
                  '<div class="holiday_name">' + '</div>' + ' </div>')
   }
}
