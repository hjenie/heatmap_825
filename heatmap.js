$(function() {


    // create configuration object
    var config = {
        container: document.getElementById('heatmapContainer'),
        radius: 80,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
    };
    // create heatmap with configuration
    var heatmapInstance = h337.create(config);

    /* get coordinate of seonsor location */
    var height = document.getElementById("heatmapContainer").clientHeight;
    window.onresize = function(){
        height = document.getElementById("heatmapContainer").clientHeight;
    };

    /* location information of each sensor. */
    SoundLocationMap = {
        "SoundWindow1" : {x : 0.45 * height, y: 0.13*height},
        "SoundWindow2" : {x : 0.68 * height, y: 0.13*height},
        "SoundWindow3" : {x : 0.9 * height, y: 0.13*height},
        "SoundEntrance1" : {x : 0.2 * height, y: 0.25*height},
        "SoundEntrance2" : {x : 0.2 * height, y: 0.35*height},
        "SoundEntrance3" : {x : 0.2 * height, y: 0.62*height},
        "SoundWall1" : {x : 0.3 * height, y: 0.93*height},
        "SoundWall2" : {x : 0.5 * height, y: 0.87*height},
        "SoundWall3" : {x : 0.8 * height, y: 0.93 *height},
    };

    MotionMap = {
        "Mtest1": { x: 0.35 * height, y: 0.85*height },
        "Htest2": { x: 0.65*height, y: 0.85*height},
        "Mtest3": { x: 0.9*height, y: 0.85*height},
        "Mtest4": { x: 0.9*height, y: 0.15*height },
        "Mtest5": { x: 0.65*height, y: 0.15*height },
        "Mtest6": { x: 0.35*height, y: 0.15*height },
        "Mtest7": { x: 0.2 * height, y: 0.3*height },
        "Mtest8": { x: 0.2 * height, y: 0.5*height },
        "Mtest9": { x: 0.2 * height, y: 0.65*height },
    };

    AmbientMap = {
        "sensor0_Temperature" : {x : height , y : 0.5 * height},
        "sensor1_Temperature" : {x :0.35 * height , y : 0.5 * height},
        "sensor0_Humidity" : {x : height, y : 0.5 * height},
        "sensor1_Humidity" : {x : 0.35* height , y : 0.5 * height},
    };

    /* Map for different sensor information */
    Sensors = {
        "Sound" : { url : "http://143.248.56.213:8090/context",
                    map : SoundLocationMap,
                    valueType : "float",
                    min : 0,
                    max : 100,     },
        "Motion" : {url : "http://143.248.56.213:8104/context",
                    map : MotionMap,
                    valueType : "boolean",
                    min : 0,
                    max : 100,       },
        "Ambient" : {url : "http://143.248.56.213:8088/context",
                    map : AmbientMap,
                    valueType : "float",
                    min : 0,
                    max : 100,      },
    };

    /* get json data and draw heatmap. */
    datapoints = [];
    refreshData = function() {
        datapoints = [];
        height = document.getElementById("heatmapContainer").clientHeight;
        for (var sensor in Sensors){
            datapoints = datapoints.concat(loadData(sensor, datapoints));
        }
    };
    setInterval(refreshData, 1000);

    /* Get points for specific sensor type.
    *  SENSOR is key of Sensors and
    *  DATAPOINTS is array of heatmap points. */
    function loadData( sensor , datapoints){
        var info = Sensors[sensor];
        var sensormap = info.map;
        $.ajax({
            url: info.url,
            type: 'GET',
            success: function(data) {
                for (var i = data.length - 1; i >= 0; i--) {

                    var loc = sensormap[data[i].name];
                    if (loc == undefined) continue;
                    else if(info.valueType == "float") {
                        datapoints.push({ x: loc.x, y: loc.y, value: data[i].value * 100/ info.max });

                    } else if (info.valueType == "boolean") {
                        if (data[i].value == false) {
                            datapoints.push({x: loc.x, y: loc.y, value: 0});
                        }
                        else {
                            datapoints.push({x: loc.x, y: loc.y, value: 1000});
                        }
                    }
                }
                drawHeatMap(datapoints);

            },
            error: function(xhr, status, error) {
                //alert("error");
            }
        });
        return datapoints;
    }

    /* set points of heatmap. */
    function drawHeatMap(datapoints){
        heatmapInstance.setData({
            max : 100,
            min : 0,
            data : datapoints
        });
    }

});
