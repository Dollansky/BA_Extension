var xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:8080/", true);
xhr.send();
xhr.onreadystatechange = apiHandler;


function apiHandler(response){
    if(xhr.readyState === 4 && xhr.status === 200){
        console.log(response)
    }
}


xhr.open('GET',"http://localhost:8080, true");
xhr.send();
