<template>
  <div>
    <div>
      <ol class="breadcrumb">
        <li><a href="/">Home</a></li>
        <li class="active">Get Started</li>
      </ol>
    </div>
    <div class="container">
      <div class="col-md-12">
        <ul class="nav nav-tabs">
          <li @click="active = 'java'" :class="[active === 'java' ? 'active' : '']">
            <a href="#">Java</a>
          </li>

          <li @click="active = 'javascript'" :class="[active === 'javascript' ? 'active' : '']">
            <a href="#">JavaScript</a>
          </li>
        </ul>
      </div>

      <div class="col-md-12" v-show="active === 'java'">
        <h1>Java</h1>
        <p>To include websocket support into your Java application, I recommend you to download these two libraries: <code>javax.websocket:javax.websocket-api:1.1</code>, <code>org.glassfish.tyrus.bundles:tyrus-standalone-client:1.13.1</code>.</p>

        <h2>Listening for Messages</h2>
        <p>Now you can connect to the web socket server using following code:</p>
        <pre>import org.glassfish.tyrus.client.ClientManager;

import javax.websocket.*;
import java.io.IOException;
import java.net.URI;
import java.util.concurrent.TimeUnit;

public class Client {
    /**
     * Connects to the web socket server.
     */
    public void connect(URI uri) {
        ClientManager client = ClientManager.createClient();

        // We attempt to establish the connection while
        try {
            client.connectToServer(new BotEndpoint(), uri);
            client.getExecutorService().awaitTermination(1, TimeUnit.DAYS);
        } catch (DeploymentException | IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private class BotEndpoint extends Endpoint {
        /**
         * On open web socket hook. Registers an event listener.
         *
         * @param session The web socket session
         * @param endpointConfig The configuration
         */
        @Override
        public void onOpen(Session session, EndpointConfig endpointConfig) {
            // The 'onMessage' method is called on the 'Handler' class upon receiving
            // a message.
            session.addMessageHandler(new Handler(session));
        }
    }
}</pre>
        <h2>Sending Responses</h2>
        <p>To send responses back to the server, you can use the <code>Session session</code> instance available in the <code>onOpen</code> method.</p>
        <pre>session.getBasicRemote().sendText("any json string goes here...")</pre>
        <br> <br> <br> <br> <br>
      </div>

      <div class="col-md-12" v-show="active === 'javascript'">
        <h1>Java Script</h1>
        <br> <br> <br> <br> <br>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 'java'
    }
  }
}
</script>
