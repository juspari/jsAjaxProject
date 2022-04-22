const newDate = new Date() //taking today's date by using javascripts date function

var today = cleanDate(newDate) //using the clean date function to get the wanted structure (dd.mm.yyyy)

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1); //using set date should make it so that the month is automatically changed when last day of the month
tomorrow = cleanDate(tomorrow);

var ylihuomenna = new Date();
ylihuomenna.setDate(ylihuomenna.getDate() + 2);
ylihuomenna = cleanDate(ylihuomenna);

var theater = document.getElementById("theaterselect"); // getting the theater code and name from the dropdown list
var theatercode = theater.value; //theatercode is used in the finnkino xml addresses
var theatername = theater.selectedOptions[0].text; // name of the select option just for presentation  

window.onload = (event) => { //when site loads, load todays movies from the first movie theater in list
    loadData(today);
}

theater.addEventListener('change', (event) =>{ //eventlistener for the dropdown list, when you select a new theater, load data from that theater
    theatercode = theater.value; //updating the values
    theatername = theater.selectedOptions[0].text;   
    loadData(today);
});

function loadData(day){ //function that loads the data from finnkino xmls using the day given as parameter

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","https://www.finnkino.fi/xml/Schedule/?area=" + theatercode + "&dt="+ day ,true); //gets the schedule from selected theater on selected day
    xmlhttp.send();

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){

            var xmlDoc = xmlhttp.responseXML;

            var shows = xmlDoc.getElementsByTagName("Title");   // getting the data that we want to use
            var startTime = xmlDoc.getElementsByTagName("dttmShowStart");
            var movieLength = xmlDoc.getElementsByTagName("LengthInMinutes")
            var ageRating = xmlDoc.getElementsByTagName("RatingImageUrl");
            var ticketLink = xmlDoc.getElementsByTagName("ShowURL"); 
            
            var taulukko = '<p id ="dateAndPlace">'+ theatername + ' ' + day +'</p><table><tr><th>Elokuva</th><th>Näytösaika</th><th>Kesto</th><th>Ikäraja</th><th>Liput</th>';
            // making the table for the data  
            for(var i = 0; i < shows.length; i++){ // for loop to populate the table with the data

                var st = startTime[i].childNodes[0].nodeValue; //help variable since movie start time needs to be trimmed           
                
                taulukko += '<tr>';
                taulukko += '<td>' + shows[i].childNodes[0].nodeValue + '</td>'; //moviename
                taulukko += '<td>' + st.substring(11,16) + '</td>'; //trimmed movie start time hh:mm
                taulukko += '<td>' + movieLength[i].childNodes[0].nodeValue + ' min</td>'; //movie length in minutes
                taulukko += '<td><img src="' + ageRating[i].childNodes[0].nodeValue + '"></td>'; //image of the age rating of the movie
                taulukko += '<td><a href ="' + ticketLink[i].childNodes[0].nodeValue + '">Osta liput</td>'; // link to the show page in finnkino webshop               
                      
            }
            taulukko += '</table>'; 
            document.getElementById("content").innerHTML = taulukko; // adding the table to the 
        }
        else{
            var errortext = '<p>Jotain meni pieleen</p>'
            document.getElementById("content").innerHTML = errortext; // in case the xml connection fails 
        }
    }
}

function padTo2Digits(num) { // this is copied from internet, what this function does is, that if a number has only one digit, it adds a 0 in front of it, so changing 1 to 01.
    return num.toString().padStart(2, '0'); //it is needed to get the correct date structure for the finnkino xml address
  }
function cleanDate(date){ //function that uses the earlier function to change dates to dd.mm.yyyy
    return padTo2Digits(date.getDate()) + "." + padTo2Digits(date.getMonth()+1) + "." +date.getFullYear(); //months start at 0 for some reason, so +1 is added
}
