import nats, { Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

class NATS_Singleton {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }

  /**
   * A wrapper for the NATS connection method
   * @param clusterId - cluster id
   * @param clientId - client id
   * @param url - url of the NATS Streaming Server
   */
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("connected to nats");
        resolve(true);
      });

      this.client.on("error", (err) => {
        console.log("failed to connect to nats");
        reject(err);
      });
    });
  }
}

export const nats_Singleton = new NATS_Singleton();
