
export const getMapStyle = () => {
    let mapColour = '#E4D3FF'
    let roadColour = "#FFFFFF" 
    return [
        {
          featureType: 'poi', //remove icons 
          stylers: [{ visibility: 'off' }]
        }, {
          featureType: "transit.station.bus", // remove bus stops 
          stylers:  [{ "visibility": "off" }]
        }, 
        {
          featureType: 'road', //remove road names
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        
        // Map Colours  
        { elementType: 'geometry', 
          stylers: [{ color: mapColour }] 
        },
        { elementType: 'labels.text.stroke', 
          stylers: [{ color: mapColour }] 
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: roadColour }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: roadColour }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: roadColour }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: roadColour }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: roadColour }]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ color: roadColour }]
        }, 
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }]
        }
      ]
}