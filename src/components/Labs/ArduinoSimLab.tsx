import React, { useState } from 'react';
import { Terminal, Play, Pause, Cpu, Lightbulb, Compass, Radio } from 'lucide-react';

export const ArduinoSimLab: React.FC = () => {
  const [ledBlinkRate, setLedBlinkRate] = useState<number>(500); // ms
  const [servoAngle, setServoAngle] = useState<number>(90); // deg
  const [distanceCm, setDistanceCm] = useState<number>(25); // cm
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [potVal, setPotVal] = useState<number>(512); // ADC 0-1023

  // Simulated Arduino Code
  const arduinoCode = `// دكتور الميكاترونكس الذكي - كود تحكم أردوينو تفاعلي
#include <Servo.h>

const int LED_PIN = 13;
const int SERVO_PIN = 9;
const int TRIG_PIN = 7;
const int ECHO_PIN = 8;
const int POT_PIN = A0;

Servo myServo;

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  myServo.attach(SERVO_PIN);
  Serial.println("System Initialized: Smart Mechatronics Doctor");
}

void loop() {
  // 1. قراءة الحساس التناظري وتوجيه السيرفو
  int adcValue = analogRead(POT_PIN); // الحالي: ${potVal}
  int angle = map(adcValue, 0, 1023, 0, 180); // الزاوية: ${servoAngle}°
  myServo.write(angle);

  // 2. قراءة حساس المسافة بالموجات فوق الصوتية
  // المسافة المقاسة: ${distanceCm} cm
  if (distanceCm < 15) {
    digitalWrite(LED_PIN, HIGH); // إنذار اقتراب
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  delay(${ledBlinkRate});
}`;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 text-slate-100 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              مختبر الأردوينو والمتحكمات الدقيقة (Arduino & MCU Lab)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              محاكاة أطراف لوحة Arduino UNO مع المحرك السيرفو وحساس الموجات فوق الصوتية وكود C++
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border ${
            isRunning
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isRunning ? 'المحاكي يعمل (Running)' : 'المحاكي متوقف'}
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Virtual Hardware Components */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              المكونات المتصلة باللوحة (Virtual Peripherals)
            </h4>

            {/* 1. LED indicator on Pin 13 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    distanceCm < 15
                      ? 'bg-rose-500/30 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/40 animate-pulse'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">مصباح التنبيه (Pin 13 LED)</div>
                  <div className="text-[10px] text-slate-400">
                    {distanceCm < 15 ? 'مشتعل (إنذار اقتراب عائق)' : 'منطفئ (الوضع آمن)'}
                  </div>
                </div>
              </div>
              <span
                className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                  distanceCm < 15 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {distanceCm < 15 ? 'HIGH (1)' : 'LOW (0)'}
              </span>
            </div>

            {/* 2. Servo Motor on Pin 9 */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  محرك السيرفو (Servo Motor - Pin 9)
                </div>
                <span className="font-mono text-xs text-cyan-400 font-bold">{servoAngle}°</span>
              </div>

              {/* Graphical Servo Horn preview */}
              <div className="flex items-center justify-center py-3">
                <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-slate-700 relative flex items-center justify-center shadow-inner">
                  {/* Rotating Horn arm */}
                  <div
                    className="absolute w-10 h-2.5 bg-cyan-500 rounded-full origin-left transition-transform duration-200 shadow-md shadow-cyan-500/50"
                    style={{
                      transform: `rotate(${servoAngle - 90}deg)`,
                      left: '50%',
                    }}
                  />
                  <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-600 z-10" />
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="180"
                value={servoAngle}
                onChange={(e) => setServoAngle(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* 3. Ultrasonic Distance Sensor on Pins 7 & 8 */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  حساس المسافة بالموجات (HC-SR04)
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold">{distanceCm} cm</span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                value={distanceCm}
                onChange={(e) => setDistanceCm(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2 cm</span>
                <span>تنبيه الخطر عند أقل من 15 cm</span>
                <span>100 cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor & Serial Output */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                sketch_mechatronics.ino
              </span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-500">
                Arduino C++
              </span>
            </div>

            <pre className="mt-3 p-3 bg-slate-900/80 rounded-lg text-[11px] font-mono text-cyan-300/90 overflow-x-auto leading-relaxed border border-slate-800/80 flex-1">
              {arduinoCode}
            </pre>

            {/* Serial Monitor Bar */}
            <div className="mt-3 p-2.5 bg-black rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
              <span>[Serial @ 9600 baud]: Distance={distanceCm}cm | Servo={servoAngle}°</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
