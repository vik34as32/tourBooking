
export const displayMap = location=>{
    mapboxgl.accessToken = 'pk.eyJ1IjoidmlrMzRhczMyIiwiYSI6ImNrdXJ6NmxnbTA1NXMzMXA3emYwNWt4YmwifQ.7nfIjP1olWfligE63fFGiQ'


    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/vik34as32/ckus0jd2b1wjn17mxsa2zhv9n',
        //  center:[],
        //  zoom:10,
        //  interactive:false
        }); 
}


const bounds =new  mapboxgl.LatlngBounds()

Locations.forEach((loc)=>{
    //create Marker
    const el =document.createElement('div')
    el.classname ='marker'
    //add marker
    new mapboxgl.Marker({
        Element:el,
        anchor:'bottom'
    }).setLatlng(loc.coordinates).addTo(map)

    //add popup
    new mapboxgl.Popup({offset:30}).setLatlng(loc.coordinates).setHTML(`<p>Day ${loc.day}:  ${loc.description}`).addTo(map)
    //extends map bounds to include current locations
    bounds.extends(loc.coordinates)
})

 map.fitBounds(bounds,{
     padding:{
     top: 200,
     bottom:150,
     left:100,
     right:100,
     }
 })