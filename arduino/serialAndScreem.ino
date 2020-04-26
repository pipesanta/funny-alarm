#include <Adafruit_GFX.h> // Hardware-specific library
#include <MCUFRIEND_kbv.h>
MCUFRIEND_kbv tft;

void setup()
{
    // put your setup code here, to run once:
    Serial.begin(9600);
    tft.reset();
    uint16_t identifier = tft.readID();
    //Serial.print("ID = 0x");
    //Serial.println(identifier, HEX);
    if (identifier == 0xEFEF) identifier = 0x9486;
    tft.begin(identifier);
    
    //  tft.fillScreen(BLACK);
    tft.setRotation(1); // { "PORTRAIT", "LANDSCAPE", "PORTRAIT_REV", "LANDSCAPE_REV" };
    
    
}

char *msg[] = { "MENSAJE DE PRUEBA" };
char dataString[50] = {0};
char *serialInput[] = { "Alarma esta activa en este momento" };
String defaultText = "            ALARMA     ESTA    ENCENDIDA"; 

void loop()
{
    // send data only when you receive data:
    if (!Serial.available()) {
      delay(100);
    }
   
    tft.fillScreen(0x0000);
    tft.setCursor(20, 0);
    tft.setTextSize(5);
    String val;

    while (Serial.available() > 0) {
      val = val + (char)Serial.read(); // read data byte by byte and store it      
    }

    if(val.substring(0,3) == "msg" ){
      lightEfects(val.substring(3), 10);
    }    
    val = "";
    
}

void lightEfects(String text, int seconds){  
  // tft.println(defaultText);
  String textToShow = text;
  if(text.substring(0, 7) == "default") {
    textToShow = defaultText;  
  }  
  
  tft.println(textToShow);
  int delayTime = 150;
  int iterations = int((seconds * 1000) / delayTime);
  
  
  
  for(int i = 0; i<iterations; i++){
    int mod = i % 2;
    bool inverted = mod == 0;
    tft.invertDisplay(inverted);
    delay(delayTime);  
  }
}


void clearScreem(){
  return "not implemented"; 
  
  }