'use strict';

const { of, defer, Observable, from } = require('rxjs');
const schedule = require('node-schedule');
const uuidv4 = require('uuid/v4');
const parser = require('cron-parser');
const { map, filter, tap, mergeMap, toArray } = require('rxjs/operators');
const { NeDB } = require('../../tools/NeDB');
const Mp3Player =  require('../mp3-player');
const CommandsExecutor = require('../commands-executor');

let instance = null;

class CronjobManager {
    constructor() {
        this.jobTaks = [];
    }

    start$() {
        return this.getAndStartAllCronjobs$();
    }

    getAllAlarms$(){
        return Observable.create(observer => {
            NeDB.alarmCollection.find({}, {}, (err, docs) => {
                if (err) {
                  observer.next(null);
                }
                observer.next(docs);
                observer.complete();
              });
          });        
    }

    getOneAlarmById$(id){
        return Observable.create(observer => {
            NeDB.alarmCollection.findOne({ _id: id, active: true } , {}, (err, doc) => {
                if (err) {
                    observer.next(null);
                }
                observer.next(doc);
                observer.complete();
            });
          });          
    }

    getAndStartAllCronjobs$() {
        return this.getAllAlarms$()
            .pipe(
                tap(r => console.log(r)),
                map(alarms => alarms.map(alarm => ({...alarm, cronFormat: this.buildCronFormat(alarm)}))),
                mergeMap(alarms => from(alarms)
                    .pipe(
                        tap(r => console.log(r)),
                        filter(alarm => alarm.active),
                        map(alarmItem =>  this.buildJobVsScheduleJobElement(alarmItem))                    
                    )            
                ),
                toArray(),
                tap(taskList => this.jobTaks = taskList )
            )
    }

    buildCronFormat({time, days}){
        console.log({time, days});

        let daysOfWeek = [
            { order: 0, key: 'Dom' },
            { order: 1, key: 'Lun' },
            { order: 2, key: 'Mar' },
            { order: 3, key: 'Mie' },
            { order: 4, key: 'Jue' },
            { order: 5, key: 'Vie' },
            { order: 6, key: 'Sab' }
          ]
          .filter(day => (days || []).includes(day.key))
          .map(dayItem => dayItem.order)
          .join(",");

          if(daysOfWeek === ''){
              daysOfWeek = '*'
          }
        
        

        const [hour, minutes] = (time || '00:00').trim().split(':');
        return `${minutes} ${hour} * * ${daysOfWeek}`;
    }

    buildJobVsScheduleJobElement(alarm) {
        if(!alarm.days || alarm.days.length == 0){
            console.log(alarm.days);
            this.desactivateAlarm(alarm._id, alarm.name);
        }

        console.log('REGISTRANDO LA TAREA');
        const job = schedule.scheduleJob(alarm.cronFormat, function () { // alarm.cronFormat            
            Mp3Player.playAudio(alarm.tone.audios)
            .then(() => {
                console.log('Termina de reproducir los audios');
                
            });

            CommandsExecutor.sendMessageToArduino('default')
                .then(() => {
                    console.log('Termina de mandar el mensaje')
                })


        })
        return ({ job, alarm });

    }

    desactivateAlarm(id, name){
        NeDB.alarmCollection.update({_id: id}, { $set: { active: false } }, {}, (err, numUpdates) => {
            if(err){ console.error('ERROR ==> ', err) }
            console.log("DESCATIVANDO LA ALARMA");
        })
    }

    removeCronjob$(cronjobId) {
        const job = this.jobTaks.find(task => task.id === cronjobId);
        if (job && job.scheduleJob) {
            job.scheduleJob.cancel();
            console.log('CANCELANDO UNA TAREA');
        }
        return of(job);        
    }

    updateCronjob$(alarmId) {
        const alarmTask = this.jobTaks.find(jt => jt.alarm._id === alarmId );
        return of(alarmTask)
            .pipe(
                tap(alarmTask => {
                    if(alarmTask && alarmTask.job){
                       alarmTask.job.cancel();
                    }
                }),
                mergeMap(() => this.getOneAlarmById$(alarmId)),
                filter(found => found != null),
                map(alarm => ({ ...alarm, cronFormat: this.buildCronFormat(alarm) }) ),
                map(alarmUpdated => {
                    console.log({ alarmUpdated });
                    return this.buildJobVsScheduleJobElement(alarmUpdated);
                }),
                tap(jobTask => {
                    console.log({jobTask});
                    
                    this.jobTaks.push(jobTask);
                } )             
            )
    }
}

/**
 * @returns {CronjobManager}
 */
module.exports = () => {
    if (!instance) {
        instance = new CronjobManager();
        console.log(`CronjobManager instance created`);
    }
    return instance;
};
