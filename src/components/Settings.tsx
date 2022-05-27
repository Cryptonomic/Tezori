import * as React from "react";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { useState } from "react";

export function Settings() {
  const { globalState, dispatch } = useContext(GlobalContext);
  const [data, setdata] = useState(null);
  const [settings_apikey, set_settings_apikey] = useState("");
  const [settings_network, set_settings_network] = useState("");
  const [print, setprint] = useState(false);

  function getdata(e) {
    setdata(e.target.value);
    setprint(false);
  }
  return (
    <div id={"settings"}>
        <div>{globalState.apiKey}</div>
      {print ? (
        <>
          <h1>{data}</h1>
          <h1>{settings_apikey}</h1>
          <h1>{settings_network}</h1>
         
        </>
      ) : null}

      <p>Tezos Node</p>
      <input
        id={"settings_tezosNode"}
        defaultValue={globalState.tezosServer}
        onChange={getdata}
      />
      <p>Nautilus API Key</p>
      <input
        id={"settings_apikey"}
        defaultValue={globalState.apiKey}
        onChange={(e) => set_settings_apikey(e.target.value)}
      />
      <p>Network</p>
      <input
        id={"settings_network"}
        defaultValue={globalState.network}
        onChange={(e) => set_settings_network(e.target.value)}
      />

      <button
        type="button"
        onClick={() => {
          setprint(true);
          dispatch({
            type: "UPDATE_VALUES",
            payload: { apiKey: settings_apikey, network: settings_network},
          });
        }}
      >
        Apply changes
      </button>
    </div>
  );
}
