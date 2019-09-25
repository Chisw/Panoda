import React, { useState, useEffect } from 'react'
import { Tabs, Tab } from '@blueprintjs/core'

import SelectGuider from './components/SelectGuider'
import Header from './components/Header'
import ProgressMask from './components/ProgressMask'
import Pano from './components/panels/Pano'
import Setting from './components/panels/Setting'

import MAP from './ts/map'
import store from './ts/store'
import { IPano } from './ts/type'

const App: React.FC = () => {

  const [loading, setLoading] = useState(false)
  const [tabId, setTabId] = useState('pano')
  const [panoFrom, setPanoFrom] = useState('')
  const [panoView, setPanoView] = useState(store.get('PANODA_PANO_VIEW') || 'list')
  const [mapSelect, setMapSelect] = useState(false)
  const [selectWith, setSelectWith] = useState('point')
  const [panos, setPanos] = useState(store.get('PANODA_PANOS') || [])
  const [checkedIds, setCheckedIds] = useState(store.get('PANODA_CHECKED_IDS') || [])

  MAP.parent.setLoading = setLoading
  MAP.parent.panos = panos
  MAP.parent.setPanos = setPanos

  const initSettings = () => {
    const isSet = store.get('PANO_SETTING_SET')
    if ( !isSet ) {
      store.set('PANO_SETTING_SET', true)

      store.set('PANO_SETTING_USEALERT', true)
      store.set('PANO_SETTING_INSERTEXIF', true)
      store.set('PANO_SETTING_WATERMARK', ['1id', '2position', '3date', '4rname', '5link'])
      store.set('PANO_SETTING_IMAGEQUALITY', '.92')
    }
  }

  useEffect(() => {
    MAP.init()
    initSettings()
  }, [])

  useEffect(() => {
    setPanoFrom('')
  }, [tabId])

  useEffect(() => {
    setMapSelect(panoFrom === 'map')
    MAP.clear()
  }, [panoFrom])

  useEffect(() => {
    if ( mapSelect ) {
      MAP.listen()
    } else {
      MAP.unlisten()
    }
  }, [mapSelect])

  useEffect(() => {
    store.set('PANODA_PANO_VIEW', panoView)
  }, [panoView])

  useEffect(() => {
    store.set('PANODA_PANOS', panos)
    
    // Synchronize
    const optionalIds = panos.map((pano: IPano) => (pano.id))
    const _checkedIds = checkedIds.filter( (id: string) => {
      return optionalIds.includes(id)
    })
    setCheckedIds(_checkedIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panos])

  useEffect(() => {
    store.set('PANODA_CHECKED_IDS', checkedIds)
  }, [checkedIds])

  return (
    <div className={`panoda-container ${panoFrom === 'map' ? 'map-expand' : ''} w-full h-full absolute top-0 right-0 bottom-0 left-0`}>

      <div className="panoda-map absolute top-0 right-50 bottom-0 left-0">
        <div id="map" className="absolute top-0 right-0 bottom-0 left-0"></div>
        <SelectGuider
          setPanoFrom={setPanoFrom}
          selectWith={selectWith}
          setSelectWith={setSelectWith}
        />
      </div>

      <div className="panoda-panel absolute top-0 right-0 bottom-0 left-50 px-10 shadow-md">
        <div className="panel-inner relative h-full">
          <Header />
          <Tabs large animate 
            className="border-b"
            id="navi" 
            key="horizontal"
            selectedTabId={tabId}
            onChange={(id: string) => {
              setTabId(id)
            }}
          >
            <Tab id="pano" title="Pano" />
            <Tab id="setting" title="Setting" />
            <Tab id="about" title="About" />
          </Tabs>
          {
            [
              <Pano
                panoView={panoView}
                setPanoView={setPanoView}
                panos={panos}
                setPanos={setPanos}
                setPanoFrom={setPanoFrom}
                checkedIds={checkedIds}
                setCheckedIds={setCheckedIds}
                setLoading={setLoading}
              />,
              <Setting />
            ][['pano', 'setting', 'about'].indexOf(tabId)]
          }
        </div>
      </div>

      <ProgressMask loading={loading} />

    </div>
  );
}

export default App
