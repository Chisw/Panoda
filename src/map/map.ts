// import MapStyle from './custom_map.json'

const G = window as any
const BMap = G.BMap

export const PANO_COVER = new BMap.PanoramaCoverageLayer()

let map: any = null

map = {
  init() {
    map = new G.BMap.Map('map', {enableMapClick: false});
    map.centerAndZoom(new G.BMap.Point(120.616675, 31.338262), 14);
    // map.setMapStyleV2({styleJson: MapStyle});
    map.enableScrollWheelZoom(true);
    
    const navigationControl = new G.BMap.NavigationControl({
      anchor: G.BMAP_ANCHOR_TOP_LEFT,
      type: G.BMAP_NAVIGATION_CONTROL_LARGE,
    });

    map.addControl(navigationControl);

    // const point = new BMap.Point(data.position.lng, data.position.lat);
    // map.panTo(point);
    // const marker = new BMap.Marker(point);  // 创建标注
    // map.addOverlay(marker);  // 将标注添加到地图中


    // map.addEventListener('click', (event) => {
    //   $('#pano-id-user').val('').trigger('input').blur();
    //   this.pano_id_user = '';
    //   this.getPanoID(event.point);
    // })
    // this.map = map;
    // map.addTileLayer(PANO_COVER)

    // map && map.panTo(new G.BMap.Point(120,31))

    G.map = map;
  }
}

export default map
