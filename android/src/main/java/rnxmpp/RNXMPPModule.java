package rnxmpp;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import java.util.logging.Logger;
import rnxmpp.service.XmppServiceSmackImpl;

/**
 * Created by Kristian Frølund on 7/19/16.
 * Copyright (c) 2016. Teletronics. All rights reserved
 */
public class RNXMPPModule extends ReactContextBaseJavaModule implements rnxmpp.service.XmppService {

    public static final String MODULE_NAME = "RNXMPP";
    Logger logger = Logger.getLogger(RNXMPPModule.class.getName());
    XmppServiceSmackImpl xmppService;

    public RNXMPPModule(ReactApplicationContext reactContext) {
        super(reactContext);
        xmppService = new XmppServiceSmackImpl(getReactApplicationContext());
    }

    public void handleIntent(Intent intent) {
        xmppService.handleIntent(intent);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Override
    @ReactMethod
    public void trustHosts(ReadableArray trustedHosts) {
        this.xmppService.trustHosts(trustedHosts);
    }

    @Override
    @ReactMethod
    public void connect(String jid, String password, String authMethod, String hostname, Integer port){
        this.xmppService.connect(jid, password, authMethod, hostname, port);
    }

    @Override
    @ReactMethod
    public void message(String text, String to,String id, String thread){
        this.xmppService.message(text, to,id, thread);
    }

    @ReactMethod
    public void decryptFile(String fileURI, String key) {
        this.xmppService.decryptFile(fileURI, key);
    }

    @ReactMethod
    public void sendFile(String fileURI) {
        this.xmppService.sendFile(fileURI);
    }

    @ReactMethod
    public void enablePushNotifications(String pushJid, String node, String secret) {
        this.xmppService.enablePushNotifications(pushJid, node, secret);
    }

    @ReactMethod
    public void setupOmemo() { this.xmppService.setupOmemo(); }

    @Override
    @ReactMethod
    public void presence(String to, String type) {
        this.xmppService.presence(to, type);
    }

    @Override
    @ReactMethod
    public void removeRoster(String to) {
        this.xmppService.removeRoster(to);
    }

    @Override
    @ReactMethod
    public void disconnect() {
        this.xmppService.disconnect();
    }

    @Override
    @ReactMethod
    public void fetchRoster() {
        this.xmppService.fetchRoster();
    }

    @Override
    @ReactMethod
    public void sendStanza(String stanza) {
        this.xmppService.sendStanza(stanza);
    }

    @Override
    @ReactMethod
    public void displayNotification(String text, String from, boolean isFile) {
        this.xmppService.displayNotification(text, from, isFile);
    }

    @Override
    @ReactMethod
    public void clearAllNotifications() {
        this.xmppService.clearAllNotifications();
    }
}
