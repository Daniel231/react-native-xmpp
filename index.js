'use strict';
var React = require('react-native');
var {DeviceEventEmitter, NativeModules} = React;
var RNXMPP = NativeModules.RNXMPP;

var map = {
    'message' : 'RNXMPPMessage',
    'regularMessage' : 'RNXMPPRegularMessage',
    'notificationOpened' : 'RNXMPPNotificationOpened',
    'iq': 'RNXMPPIQ',
    'presence': 'RNXMPPPresence',
    'connect': 'RNXMPPConnect',
    'disconnect': 'RNXMPPDisconnect',
    'error': 'RNXMPPError',
    'loginError': 'RNXMPPLoginError',
    'login': 'RNXMPPLogin',
    'omemo': 'RNXMPPOmemoInitResult',
    'roster': 'RNXMPPRoster',
    'recepit': 'RNXMPPRecepit',
    'file': 'RNXMPPFile',
}

const LOG = (message) => {
  if (__DEV__) {
    console.log('react-native-xmpp: ' + message);
  }
}

class XMPP {
    PLAIN = RNXMPP.PLAIN;
    SCRAM = RNXMPP.SCRAMSHA1;
    MD5 = RNXMPP.DigestMD5;

    constructor(){
        this.isConnected = false;
        this.isLogged = false;
        this.listeners = [
            DeviceEventEmitter.addListener(map.connect, this.onConnected.bind(this)),
            DeviceEventEmitter.addListener(map.disconnect, this.onDisconnected.bind(this)),
            DeviceEventEmitter.addListener(map.error, this.onError.bind(this)),
            DeviceEventEmitter.addListener(map.loginError, this.onLoginError.bind(this)),
            DeviceEventEmitter.addListener(map.login, this.onLogin.bind(this)),
            DeviceEventEmitter.addListener(map.recepit, this.onRecepit.bind(this)),
            DeviceEventEmitter.addListener(map.file, this.onFile.bind(this)),
        ];
    }

    onFile(filePath) {
        LOG("file recevied path: "+filePath);
    }

    onConnected(){
        LOG("Connected");
        this.isConnected = true;
    }

    onRecepit(recepit) {
        LOG("message Recepit: " + recepit);
    }

    onLogin(){
        LOG("Login");
        this.isLogged = true;
    }

    onDisconnected(error){
        LOG("Disconnected, error: "+error);
        this.isConnected = false;
        this.isLogged = false;
    }

    onError(text){
        LOG("Error: "+text);
    }

    onLoginError(text){
        this.isLogged = false;
        LOG("LoginError: "+text);
    }

    on(type, callback){
        if (map[type]){
            const listener = DeviceEventEmitter.addListener(map[type], callback);
            this.listeners.push(listener);
            return listener;
        } else {
            throw "No registered type: " + type;
        }
    }

    removeListener(type) {
        if (map[type]) {
            for (var i = 0; i < this.listeners.length; i++) {
                var listener = this.listeners[i];
                if (listener.eventType === map[type]) {
                    listener.remove();
                    var index = this.listeners.indexOf(listener);
                    if (index > -1) {
                        this.listeners.splice(index, 1);
                    }
                    LOG(`Event listener of type "${type}" removed`);
                }
            }
        }
    }

    removeListeners() {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].remove();
        }

        this.listeners = [
            DeviceEventEmitter.addListener(map.connect, this.onConnected.bind(this)),
            DeviceEventEmitter.addListener(map.disconnect, this.onDisconnected.bind(this)),
            DeviceEventEmitter.addListener(map.error, this.onError.bind(this)),
            DeviceEventEmitter.addListener(map.loginError, this.onLoginError.bind(this)),
            DeviceEventEmitter.addListener(map.login, this.onLogin.bind(this)),
            DeviceEventEmitter.addListener(map.file, this.onFile.bind(this)),
            DeviceEventEmitter.addListener(map.recepit, this.onRecepit.bind(this)),
        ];
        
        LOG('All event listeners removed');
    }

    //Really remove listeners
    reallyRemoveListeners() {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].remove();
        }
        
        LOG('All event listeners removed');
    }

    restartListeners() {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].remove();
        }

        this.listeners = [
            DeviceEventEmitter.addListener(map.connect, this.onConnected.bind(this)),
            DeviceEventEmitter.addListener(map.disconnect, this.onDisconnected.bind(this)),
            DeviceEventEmitter.addListener(map.error, this.onError.bind(this)),
            DeviceEventEmitter.addListener(map.loginError, this.onLoginError.bind(this)),
            DeviceEventEmitter.addListener(map.login, this.onLogin.bind(this)),
            DeviceEventEmitter.addListener(map.file, this.onFile.bind(this)),
        ];
        
        LOG('All event listeners removed');
    }

    trustHosts(hosts){
        React.NativeModules.RNXMPP.trustHosts(hosts);
    }

    connect(username, password, auth = RNXMPP.SCRAMSHA1, hostname = null, port = 5222){
        if (!hostname){
            hostname = (username+'@/').split('@')[1].split('/')[0];
        }
        React.NativeModules.RNXMPP.connect(username, password, auth, hostname, port);
    }

    message(text, user,id, thread = null){
        LOG(`Message: "${text}" being sent to user: ${user}`);
        React.NativeModules.RNXMPP.message(text, user,id,thread);
    }

    decryptFile(fileURI, key) {
        return React.NativeModules.RNXMPP.decryptFile(fileURI, key);
    }

    sendFile(fileURI) {
        return React.NativeModules.RNXMPP.sendFile(fileURI);
    }

    enablePushNotifications(pushJid, node, secret) {
        return React.NativeModules.RNXMPP.enablePushNotifications(pushJid, node, secret);
    }

    sendStanza(stanza){
        RNXMPP.sendStanza(stanza);
    }

    displayNotification(text, from, isFile) {
        React.NativeModules.RNXMPP.displayNotification(text, from, isFile);
    }

    clearAllNotifications() {
        React.NativeModules.RNXMPP.clearAllNotifications();
    }

    fetchRoster(){
        RNXMPP.fetchRoster();
    }

    presence(to, type){
        React.NativeModules.RNXMPP.presence(to, type);
    }

    removeFromRoster(to){
        React.NativeModules.RNXMPP.removeRoster(to);
    }

    disconnect(){
        if (this.isConnected){
            React.NativeModules.RNXMPP.disconnect();
        }
    }
    disconnectAfterSending(){
      if (this.isConnected){
        React.NativeModules.RNXMPP.disconnectAfterSending();
      }
    }
}

module.exports = new XMPP();
