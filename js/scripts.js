// API UTILIZADA: https://developer.accuweather.com/apis


// Método que busca as informações da localização digitada
document.getElementById('lista_busca').style.display = 'none';
const buscaAutomatica = async () => {
    var q = document.getElementById('local').value;
    var apikey = 'FRA4sNMyyDbvG5V8gQZISDifa3NuUszv'; 
    const response = await fetch('http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=' + apikey + '&q=' + q + '&language=pt-br');
    const myJson = await response.json();
    
  
    localStorage.setItem("key", myJson[0].Key);
    console.log(myJson.length);

    console.log('Local: ' + myJson[0].LocalizedName);

    var cidade = myJson[0].LocalizedName;
    var estado = myJson[0].AdministrativeArea.LocalizedName;
    var pais = myJson[0].Country.LocalizedName;
  
    
    document.getElementById('texto_local').innerHTML = cidade + ', ' + estado + '. ' + pais;

    atualizaInfo();
    atualizaDias();
  }
document.getElementById('search-button').onclick = buscaAutomatica;


// Método que atualiza as informações principais do dia
const atualizaInfo = async () => {
    var id = localStorage.getItem('key');
    console.log('Local: ' + id);
    var apikey = 'FRA4sNMyyDbvG5V8gQZISDifa3NuUszv'; 
    const response = await fetch('http://dataservice.accuweather.com/currentconditions/v1/' + id +'?apikey=' + apikey +'&language=pt-br');
    const myJson = await response.json();

    var idIcone = trataIcone(myJson[0].WeatherIcon);

    console.log('Temperatura: ' + myJson[0].Temperature.Metric.Value);
    document.getElementById('texto_clima').innerHTML = myJson[0].WeatherText;
    document.getElementById('texto_temperatura').innerHTML = myJson[0].Temperature.Metric.Value + '°' + myJson[0].Temperature.Metric.Unit;
    document.getElementById('icone_clima').style.backgroundImage = "url('https://developer.accuweather.com/sites/default/files/"+idIcone+"-s.png')"; 

}


// Método que atualiza as informações dos 4 próximos dias
const atualizaDias = async () => {
  var id = localStorage.getItem('key');
  var apikey = 'FRA4sNMyyDbvG5V8gQZISDifa3NuUszv'; 
  const response = await fetch('http://dataservice.accuweather.com/forecasts/v1/daily/5day/' + id + '?apikey='+apikey+'&language=pt-br&metric=true');
  const myJson = await response.json();

  var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
  var data = new Date();
  var noite = false;

  //Verifica o horário para ver se é noite ou não
  if(data.getHours() < 5 && data.getHours() > 19){
    noite = true;
  }else{
    noite = false;
  }  

  console.log('Noite: ' + noite + ' | Hora atual: ' + data.getHours());

  //HOJE
  var min_hoje = myJson.DailyForecasts[0].Temperature.Minimum.Value;
  var max_hoje = myJson.DailyForecasts[0].Temperature.Maximum.Value;
  document.getElementById('texto_max_min').innerHTML = min_hoje + '°C / ' + max_hoje + '°C';

  //PRÓXIMOS DIAS
  var dias = document.getElementsByClassName("dayname");
  var temperatura_dias = document.getElementsByClassName("max_min_temp");
  var icone_semanas = document.getElementsByClassName("daily_weather_icon");
  
  for(var i = 0; i < dias.length; i++){
    // Trata o dia da semana
      var data_semana = new Date(myJson.DailyForecasts[i].Date);
      dias[i].innerHTML = semana[data_semana.getDay()];
      console.log('Dia da semana: ' + semana[data_semana.getDay()]);
  
    // Trata a temperatura mínima e máxima 
      var min_previsao = myJson.DailyForecasts[i].Temperature.Minimum.Value;
      var max_previsao = myJson.DailyForecasts[i].Temperature.Maximum.Value;
      temperatura_dias[i+1].innerHTML = min_previsao + '°C / ' + max_previsao + '°C';
      console.log(min_previsao + '°C / ' + max_previsao + '°C');

    // Trata os icones
    if(noite){
      var id_icon = trataIcone(myJson.DailyForecasts[i].Night.Icon);
      var icone_semana_1 = "url('https://developer.accuweather.com/sites/default/files/"+id_icon+"-s.png')";
    }else{
      var id_icon = trataIcone(myJson.DailyForecasts[i].Day.Icon);
      var icone_semana_1 = "url('https://developer.accuweather.com/sites/default/files/"+id_icon+"-s.png')";
    }

    icone_semanas[i].style.backgroundImage = icone_semana_1;

  }

}

// MÉTODOS UTILITÁRIOS
// Método que adiciona o 0 antes de números menores que 10
function trataIcone(idIcone){
  var resposta;
  if(idIcone < 10){
      resposta = '0' + idIcone;
  }else{
      resposta = idIcone;
  }
  return resposta;
}
//===============================================================================================