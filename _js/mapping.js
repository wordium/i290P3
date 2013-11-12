/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var MAP_ID = '#world-map';
var map;
var mapData = [];
var mapScale;
var mapMax = 0;
var MAX_RADIUS = 50;
var MIN_RADIUS = 5;
var mapProfiles = {};
var defaultOptions = {
    scope: 'world', //currently supports 'usa' and 'world', however with custom map data you can specify your own
//    setProjection: d3.geo.mercator(), //returns a d3 path and projection functions
//    projection: 'mercator', //'equirectangular', //style of projection to be used. try "mercator"
    projection: 'equirectangular',
    done: function() {
    }, //callback when the map is done drawing
    fills: {
        defaultFill: '#ABDDA4'  //the keys in this object map to the "fillKey" of [data] or [bubbles]
    },
    geographyConfig: {
        dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
        hideAntarctica: true,
        borderWidth: 1,
        borderColor: '#FDFDFD',
        popupTemplate: function(geography, data) { //this function should just return a string
            console.log(data);
            console.log(geography);
            return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
        },
        popupOnHover: true, //disable the popup while hovering
        highlightOnHover: true,
        highlightFillColor: '#FC8D59',
        highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
        highlightBorderWidth: 2
    },
    bubblesConfig: {
        borderWidth: 2,
        borderColor: '#ff0000',
        popupOnHover: true,
        popupTemplate: function(geography, data) {

            return '<div class="hoverinfo"><strong>' + data.name + '</strong></div>';
        },
        fillOpacity: 0.75,
        highlightOnHover: true,
        highlightFillColor: '#FC8D59',
        highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
        highlightBorderWidth: 2,
        highlightFillOpacity: 0.85
    },
    arcConfig: {
        strokeColor: '#DD1C77',
        strokeWidth: 1,
        arcSharpness: 1,
        animationSpeed: 600
    }
};
function drawMap(profiles)
{
    initMap();
    mapData = prepareMapData(profiles);
    drawBubbles();
}

function initMap()
{
    map = new Datamap({
        element: document.getElementById('world-map'),
        scope: 'world',
        geographyConfig: {
            popupOnHover: true,
            highlightOnHover: true
        },
        fills: {'SELECTED': '#FBDDA4', defaultFill: '#ABDDA4'}});
//    $(MAP_ID).datamaps(defaultOptions);

    var position = $(MAP_ID).position();
    console.log(position);
    $('#datamaps-hoverover').css('position', 'relative');
}


function prepareMapData(profiles)
{
    var dataset = {};
    var count = 0;
    for (var i = 0, j = profiles.length; i < j; i++)
    {
        var profile = new UserProfile();
        profile = profiles[i];
        var countryCode = profile.countryCode;
//        console.log(countryCode);
        if (dataset[countryCode])
        {
            dataset[countryCode].count++;
            dataset[countryCode].profiles.push(profile);
            mapProfiles[countryCode].push(profile);
        }
        else
        {
            dataset[countryCode] = {'count': 1, 'profiles': [profile]};
            mapProfiles[countryCode] = [profile];
            count++;
        }
    }
    for (var key in dataset)
        mapMax = (mapMax < dataset[key].count) ? dataset[key].count : mapMax;

    mapScale = d3.scale.linear().domain([0, mapMax])
            .range([MIN_RADIUS, MAX_RADIUS]);


//    console.log(dataset);
    var dataArray = [];
    for (var key in dataset)
    {
//        console.log(key);
        var country = countries[key];
//        console.log(mapScale(dataset[key].count));
        if (country) {
//        console.log(country);
            var obj = {country: country['code'],
                'countryCode': key,
                'countryName': country['name'],
                'count': dataset[key].count,
                latitude: country['lat'],
                longitude: country['lon'],
                radius: mapScale(dataset[key].count),
                name: country['name'],
                'profiles': dataset[key].profiles,
                fillKey: 'SELECTED'}
            dataArray.push(obj);
        }
    }


    console.log(dataArray);

    return dataArray;
}
function drawBubbles()
{

//    console.log('drawing bubles');

    map.bubbles(mapData, {
        popupTemplate: function(geography, data) {
            return ['<div class="hoverinfo"><strong>' + data.countryName + '</strong>',
                '<br/>Count: ' + data.count + ' members',
                '</div>'].join('');
        }
    });

    $('.datamaps-bubble').on('click', function() {
        console.log('bubble clicked');
        var self = $(this);
        var data = JSON.parse(self.attr('data-info'));
        console.log(data);

        var country = data.countryCode;
        console.log(country);
        displayPreview(data.profiles, data.countryName);
//        var profiles = mapProfiles[country].profiles;


    });
}

var countries =
        {
            'AF': {'code': 'AFG', 'name': 'Afghanistan', 'lat': 33, 'lon': 65},
            'AL': {'code': 'ALB', 'name': 'Albania', 'lat': 41, 'lon': 20},
            'DZ': {'code': 'DZA', 'name': 'Algeria', 'lat': 28, 'lon': 3},
            'AS': {'code': 'ASM', 'name': 'American Samoa', 'lat': -14.3333, 'lon': -170},
            'AD': {'code': 'AND', 'name': 'Andorra', 'lat': 42.5, 'lon': 1.6},
            'AO': {'code': 'AGO', 'name': 'Angola', 'lat': -12.5, 'lon': 18.5},
            'AI': {'code': 'AIA', 'name': 'Anguilla', 'lat': 18.25, 'lon': -63.1667},
            'AQ': {'code': 'ATA', 'name': 'Antarctica', 'lat': -90, 'lon': 0},
            'AG': {'code': 'ATG', 'name': 'Antigua and Barbuda', 'lat': 17.05, 'lon': -61.8},
            'AR': {'code': 'ARG', 'name': 'Argentina', 'lat': -34, 'lon': -64},
            'AM': {'code': 'ARM', 'name': 'Armenia', 'lat': 40, 'lon': 45},
            'AW': {'code': 'ABW', 'name': 'Aruba', 'lat': 12.5, 'lon': -69.9667},
            'AU': {'code': 'AUS', 'name': 'Australia', 'lat': -27, 'lon': 133},
            'AT': {'code': 'AUT', 'name': 'Austria', 'lat': 47.3333, 'lon': 13.3333},
            'AZ': {'code': 'AZE', 'name': 'Azerbaijan', 'lat': 40.5, 'lon': 47.5},
            'BS': {'code': 'BHS', 'name': 'Bahamas', 'lat': 24.25, 'lon': -76},
            'BH': {'code': 'BHR', 'name': 'Bahrain', 'lat': 26, 'lon': 50.55},
            'BD': {'code': 'BGD', 'name': 'Bangladesh', 'lat': 24, 'lon': 90},
            'BB': {'code': 'BRB', 'name': 'Barbados', 'lat': 13.1667, 'lon': -59.5333},
            'BY': {'code': 'BLR', 'name': 'Belarus', 'lat': 53, 'lon': 28},
            'BE': {'code': 'BEL', 'name': 'Belgium', 'lat': 50.8333, 'lon': 4},
            'BZ': {'code': 'BLZ', 'name': 'Belize', 'lat': 17.25, 'lon': -88.75},
            'BJ': {'code': 'BEN', 'name': 'Benin', 'lat': 9.5, 'lon': 2.25},
            'BM': {'code': 'BMU', 'name': 'Bermuda', 'lat': 32.3333, 'lon': -64.75},
            'BT': {'code': 'BTN', 'name': 'Bhutan', 'lat': 27.5, 'lon': 90.5},
            'BO': {'code': 'BOL', 'name': 'Bolivia, Plurinational State of', 'lat': -17, 'lon': -65},
            'BA': {'code': 'BIH', 'name': 'Bosnia and Herzegovina', 'lat': 44, 'lon': 18},
            'BW': {'code': 'BWA', 'name': 'Botswana', 'lat': -22, 'lon': 24},
            'BV': {'code': 'BVT', 'name': 'Bouvet Island', 'lat': -54.4333, 'lon': 3.4},
            'BR': {'code': 'BRA', 'name': 'Brazil', 'lat': -10, 'lon': -55},
            'IO': {'code': 'IOT', 'name': 'British Indian Ocean Territory', 'lat': -6, 'lon': 71.5},
            'BN': {'code': 'BRN', 'name': 'Brunei Darussalam', 'lat': 4.5, 'lon': 114.6667},
            'BG': {'code': 'BGR', 'name': 'Bulgaria', 'lat': 43, 'lon': 25},
            'BF': {'code': 'BFA', 'name': 'Burkina Faso', 'lat': 13, 'lon': -2},
            'BI': {'code': 'BDI', 'name': 'Burundi', 'lat': -3.5, 'lon': 30},
            'KH': {'code': 'KHM', 'name': 'Cambodia', 'lat': 13, 'lon': 105},
            'CM': {'code': 'CMR', 'name': 'Cameroon', 'lat': 6, 'lon': 12},
            'CA': {'code': 'CAN', 'name': 'Canada', 'lat': 60, 'lon': -95},
            'CV': {'code': 'CPV', 'name': 'Cape Verde', 'lat': 16, 'lon': -24},
            'KY': {'code': 'CYM', 'name': 'Cayman Islands', 'lat': 19.5, 'lon': -80.5},
            'CF': {'code': 'CAF', 'name': 'Central African Republic', 'lat': 7, 'lon': 21},
            'TD': {'code': 'TCD', 'name': 'Chad', 'lat': 15, 'lon': 19},
            'CL': {'code': 'CHL', 'name': 'Chile', 'lat': -30, 'lon': -71},
            'CN': {'code': 'CHN', 'name': 'China', 'lat': 35, 'lon': 105},
            'CX': {'code': 'CXR', 'name': 'Christmas Island', 'lat': -10.5, 'lon': 105.6667},
            'CC': {'code': 'CCK', 'name': 'Cocos (Keeling) Islands', 'lat': -12.5, 'lon': 96.8333},
            'CO': {'code': 'COL', 'name': 'Colombia', 'lat': 4, 'lon': -72},
            'KM': {'code': 'COM', 'name': 'Comoros', 'lat': -12.1667, 'lon': 44.25},
            'CG': {'code': 'COG', 'name': 'Congo', 'lat': -1, 'lon': 15},
            'CD': {'code': 'COD', 'name': 'Congo, the Democratic Republic of the', 'lat': 0, 'lon': 25},
            'CK': {'code': 'COK', 'name': 'Cook Islands', 'lat': -21.2333, 'lon': -159.7667},
            'CR': {'code': 'CRI', 'name': 'Costa Rica', 'lat': 10, 'lon': -84},
            'CI': {'code': 'CIV', 'name': 'CÃ´te d`Ivoire', 'lat': 8, 'lon': -5},
            'HR': {'code': 'HRV', 'name': 'Croatia', 'lat': 45.1667, 'lon': 15.5},
            'CU': {'code': 'CUB', 'name': 'Cuba', 'lat': 21.5, 'lon': -80},
            'CY': {'code': 'CYP', 'name': 'Cyprus', 'lat': 35, 'lon': 33},
            'CZ': {'code': 'CZE', 'name': 'Czech Republic', 'lat': 49.75, 'lon': 15.5},
            'DK': {'code': 'DNK', 'name': 'Denmark', 'lat': 56, 'lon': 10},
            'DJ': {'code': 'DJI', 'name': 'Djibouti', 'lat': 11.5, 'lon': 43},
            'DM': {'code': 'DMA', 'name': 'Dominica', 'lat': 15.4167, 'lon': -61.3333},
            'DO': {'code': 'DOM', 'name': 'Dominican Republic', 'lat': 19, 'lon': -70.6667},
            'EC': {'code': 'ECU', 'name': 'Ecuador', 'lat': -2, 'lon': -77.5},
            'EG': {'code': 'EGY', 'name': 'Egypt', 'lat': 27, 'lon': 30},
            'SV': {'code': 'SLV', 'name': 'El Salvador', 'lat': 13.8333, 'lon': -88.9167},
            'GQ': {'code': 'GNQ', 'name': 'Equatorial Guinea', 'lat': 2, 'lon': 10},
            'ER': {'code': 'ERI', 'name': 'Eritrea', 'lat': 15, 'lon': 39},
            'EE': {'code': 'EST', 'name': 'Estonia', 'lat': 59, 'lon': 26},
            'ET': {'code': 'ETH', 'name': 'Ethiopia', 'lat': 8, 'lon': 38},
            'FK': {'code': 'FLK', 'name': 'Falkland Islands (Malvinas)', 'lat': -51.75, 'lon': -59},
            'FO': {'code': 'FRO', 'name': 'Faroe Islands', 'lat': 62, 'lon': -7},
            'FJ': {'code': 'FJI', 'name': 'Fiji', 'lat': -18, 'lon': 175},
            'FI': {'code': 'FIN', 'name': 'Finland', 'lat': 64, 'lon': 26},
            'FR': {'code': 'FRA', 'name': 'France', 'lat': 46, 'lon': 2},
            'GF': {'code': 'GUF', 'name': 'French Guiana', 'lat': 4, 'lon': -53},
            'PF': {'code': 'PYF', 'name': 'French Polynesia', 'lat': -15, 'lon': -140},
            'TF': {'code': 'ATF', 'name': 'French Southern Territories', 'lat': -43, 'lon': 67},
            'GA': {'code': 'GAB', 'name': 'Gabon', 'lat': -1, 'lon': 11.75},
            'GM': {'code': 'GMB', 'name': 'Gambia', 'lat': 13.4667, 'lon': -16.5667},
            'GE': {'code': 'GEO', 'name': 'Georgia', 'lat': 42, 'lon': 43.5},
            'DE': {'code': 'DEU', 'name': 'Germany', 'lat': 51, 'lon': 9},
            'GH': {'code': 'GHA', 'name': 'Ghana', 'lat': 8, 'lon': -2},
            'GI': {'code': 'GIB', 'name': 'Gibraltar', 'lat': 36.1833, 'lon': -5.3667},
            'GR': {'code': 'GRC', 'name': 'Greece', 'lat': 39, 'lon': 22},
            'GL': {'code': 'GRL', 'name': 'Greenland', 'lat': 72, 'lon': -40},
            'GD': {'code': 'GRD', 'name': 'Grenada', 'lat': 12.1167, 'lon': -61.6667},
            'GP': {'code': 'GLP', 'name': 'Guadeloupe', 'lat': 16.25, 'lon': -61.5833},
            'GU': {'code': 'GUM', 'name': 'Guam', 'lat': 13.4667, 'lon': 144.7833},
            'GT': {'code': 'GTM', 'name': 'Guatemala', 'lat': 15.5, 'lon': -90.25},
            'GG': {'code': 'GGY', 'name': 'Guernsey', 'lat': 49.5, 'lon': -2.56},
            'GN': {'code': 'GIN', 'name': 'Guinea', 'lat': 11, 'lon': -10},
            'GW': {'code': 'GNB', 'name': 'Guinea-Bissau', 'lat': 12, 'lon': -15},
            'GY': {'code': 'GUY', 'name': 'Guyana', 'lat': 5, 'lon': -59},
            'HT': {'code': 'HTI', 'name': 'Haiti', 'lat': 19, 'lon': -72.4167},
            'HM': {'code': 'HMD', 'name': 'Heard Island and McDonald Islands', 'lat': -53.1, 'lon': 72.5167},
            'VA': {'code': 'VAT', 'name': 'Holy See (Vatican City State)', 'lat': 41.9, 'lon': 12.45},
            'HN': {'code': 'HND', 'name': 'Honduras', 'lat': 15, 'lon': -86.5},
            'HK': {'code': 'HKG', 'name': 'Hong Kong', 'lat': 22.25, 'lon': 114.1667},
            'HU': {'code': 'HUN', 'name': 'Hungary', 'lat': 47, 'lon': 20},
            'IS': {'code': 'ISL', 'name': 'Iceland', 'lat': 65, 'lon': -18},
            'IN': {'code': 'IND', 'name': 'India', 'lat': 20, 'lon': 77},
            'ID': {'code': 'IDN', 'name': 'Indonesia', 'lat': -5, 'lon': 120},
            'IR': {'code': 'IRN', 'name': 'Iran, Islamic Republic of', 'lat': 32, 'lon': 53},
            'IQ': {'code': 'IRQ', 'name': 'Iraq', 'lat': 33, 'lon': 44},
            'IE': {'code': 'IRL', 'name': 'Ireland', 'lat': 53, 'lon': -8},
            'IM': {'code': 'IMN', 'name': 'Isle of Man', 'lat': 54.23, 'lon': -4.55},
            'IL': {'code': 'ISR', 'name': 'Israel', 'lat': 31.5, 'lon': 34.75},
            'IT': {'code': 'ITA', 'name': 'Italy', 'lat': 42.8333, 'lon': 12.8333},
            'JM': {'code': 'JAM', 'name': 'Jamaica', 'lat': 18.25, 'lon': -77.5},
            'JP': {'code': 'JPN', 'name': 'Japan', 'lat': 36, 'lon': 138},
            'JE': {'code': 'JEY', 'name': 'Jersey', 'lat': 49.21, 'lon': -2.13},
            'JO': {'code': 'JOR', 'name': 'Jordan', 'lat': 31, 'lon': 36},
            'KZ': {'code': 'KAZ', 'name': 'Kazakhstan', 'lat': 48, 'lon': 68},
            'KE': {'code': 'KEN', 'name': 'Kenya', 'lat': 1, 'lon': 38},
            'KI': {'code': 'KIR', 'name': 'Kiribati', 'lat': 1.4167, 'lon': 173},
            'KP': {'code': 'PRK', 'name': 'Korea, Democratic People`s Republic of', 'lat': 40, 'lon': 127},
            'KR': {'code': 'KOR', 'name': 'Korea, Republic of', 'lat': 37, 'lon': 127.5},
            'KW': {'code': 'KWT', 'name': 'Kuwait', 'lat': 29.3375, 'lon': 47.6581},
            'KG': {'code': 'KGZ', 'name': 'Kyrgyzstan', 'lat': 41, 'lon': 75},
            'LA': {'code': 'LAO', 'name': 'Lao People`s Democratic Republic', 'lat': 18, 'lon': 105},
            'LV': {'code': 'LVA', 'name': 'Latvia', 'lat': 57, 'lon': 25},
            'LB': {'code': 'LBN', 'name': 'Lebanon', 'lat': 33.8333, 'lon': 35.8333},
            'LS': {'code': 'LSO', 'name': 'Lesotho', 'lat': -29.5, 'lon': 28.5},
            'LR': {'code': 'LBR', 'name': 'Liberia', 'lat': 6.5, 'lon': -9.5},
            'LY': {'code': 'LBY', 'name': 'Libyan Arab Jamahiriya', 'lat': 25, 'lon': 17},
            'LI': {'code': 'LIE', 'name': 'Liechtenstein', 'lat': 47.1667, 'lon': 9.5333},
            'LT': {'code': 'LTU', 'name': 'Lithuania', 'lat': 56, 'lon': 24},
            'LU': {'code': 'LUX', 'name': 'Luxembourg', 'lat': 49.75, 'lon': 6.1667},
            'MO': {'code': 'MAC', 'name': 'Macao', 'lat': 22.1667, 'lon': 113.55},
            'MK': {'code': 'MKD', 'name': 'Macedonia, the former Yugoslav Republic of', 'lat': 41.8333, 'lon': 22},
            'MG': {'code': 'MDG', 'name': 'Madagascar', 'lat': -20, 'lon': 47},
            'MW': {'code': 'MWI', 'name': 'Malawi', 'lat': -13.5, 'lon': 34},
            'MY': {'code': 'MYS', 'name': 'Malaysia', 'lat': 2.5, 'lon': 112.5},
            'MV': {'code': 'MDV', 'name': 'Maldives', 'lat': 3.25, 'lon': 73},
            'ML': {'code': 'MLI', 'name': 'Mali', 'lat': 17, 'lon': -4},
            'MT': {'code': 'MLT', 'name': 'Malta', 'lat': 35.8333, 'lon': 14.5833},
            'MH': {'code': 'MHL', 'name': 'Marshall Islands', 'lat': 9, 'lon': 168},
            'MQ': {'code': 'MTQ', 'name': 'Martinique', 'lat': 14.6667, 'lon': -61},
            'MR': {'code': 'MRT', 'name': 'Mauritania', 'lat': 20, 'lon': -12},
            'MU': {'code': 'MUS', 'name': 'Mauritius', 'lat': -20.2833, 'lon': 57.55},
            'YT': {'code': 'MYT', 'name': 'Mayotte', 'lat': -12.8333, 'lon': 45.1667},
            'MX': {'code': 'MEX', 'name': 'Mexico', 'lat': 23, 'lon': -102},
            'FM': {'code': 'FSM', 'name': 'Micronesia, Federated States of', 'lat': 6.9167, 'lon': 158.25},
            'MD': {'code': 'MDA', 'name': 'Moldova, Republic of', 'lat': 47, 'lon': 29},
            'MC': {'code': 'MCO', 'name': 'Monaco', 'lat': 43.7333, 'lon': 7.4},
            'MN': {'code': 'MNG', 'name': 'Mongolia', 'lat': 46, 'lon': 105},
            'ME': {'code': 'MNE', 'name': 'Montenegro', 'lat': 42, 'lon': 19},
            'MS': {'code': 'MSR', 'name': 'Montserrat', 'lat': 16.75, 'lon': -62.2},
            'MA': {'code': 'MAR', 'name': 'Morocco', 'lat': 32, 'lon': -5},
            'MZ': {'code': 'MOZ', 'name': 'Mozambique', 'lat': -18.25, 'lon': 35},
            'MM': {'code': 'MMR', 'name': 'Myanmar', 'lat': 22, 'lon': 98},
            'NA': {'code': 'NAM', 'name': 'Namibia', 'lat': -22, 'lon': 17},
            'NR': {'code': 'NRU', 'name': 'Nauru', 'lat': -0.5333, 'lon': 166.9167},
            'NP': {'code': 'NPL', 'name': 'Nepal', 'lat': 28, 'lon': 84},
            'NL': {'code': 'NLD', 'name': 'Netherlands', 'lat': 52.5, 'lon': 5.75},
            'AN': {'code': 'ANT', 'name': 'Netherlands Antilles', 'lat': 12.25, 'lon': -68.75},
            'NC': {'code': 'NCL', 'name': 'New Caledonia', 'lat': -21.5, 'lon': 165.5},
            'NZ': {'code': 'NZL', 'name': 'New Zealand', 'lat': -41, 'lon': 174},
            'NI': {'code': 'NIC', 'name': 'Nicaragua', 'lat': 13, 'lon': -85},
            'NE': {'code': 'NER', 'name': 'Niger', 'lat': 16, 'lon': 8},
            'NG': {'code': 'NGA', 'name': 'Nigeria', 'lat': 10, 'lon': 8},
            'NU': {'code': 'NIU', 'name': 'Niue', 'lat': -19.0333, 'lon': -169.8667},
            'NF': {'code': 'NFK', 'name': 'Norfolk Island', 'lat': -29.0333, 'lon': 167.95},
            'MP': {'code': 'MNP', 'name': 'Northern Mariana Islands', 'lat': 15.2, 'lon': 145.75},
            'NO': {'code': 'NOR', 'name': 'Norway', 'lat': 62, 'lon': 10},
            'OM': {'code': 'OMN', 'name': 'Oman', 'lat': 21, 'lon': 57},
            'PK': {'code': 'PAK', 'name': 'Pakistan', 'lat': 30, 'lon': 70},
            'PW': {'code': 'PLW', 'name': 'Palau', 'lat': 7.5, 'lon': 134.5},
            'PS': {'code': 'PSE', 'name': 'Palestinian Territory, Occupied', 'lat': 32, 'lon': 35.25},
            'PA': {'code': 'PAN', 'name': 'Panama', 'lat': 9, 'lon': -80},
            'PG': {'code': 'PNG', 'name': 'Papua New Guinea', 'lat': -6, 'lon': 147},
            'PY': {'code': 'PRY', 'name': 'Paraguay', 'lat': -23, 'lon': -58},
            'PE': {'code': 'PER', 'name': 'Peru', 'lat': -10, 'lon': -76},
            'PH': {'code': 'PHL', 'name': 'Philippines', 'lat': 13, 'lon': 122},
            'PN': {'code': 'PCN', 'name': 'Pitcairn', 'lat': -24.7, 'lon': -127.4},
            'PL': {'code': 'POL', 'name': 'Poland', 'lat': 52, 'lon': 20},
            'PT': {'code': 'PRT', 'name': 'Portugal', 'lat': 39.5, 'lon': -8},
            'PR': {'code': 'PRI', 'name': 'Puerto Rico', 'lat': 18.25, 'lon': -66.5},
            'QA': {'code': 'QAT', 'name': 'Qatar', 'lat': 25.5, 'lon': 51.25},
            'RE': {'code': 'REU', 'name': 'RÃ©union', 'lat': -21.1, 'lon': 55.6},
            'RO': {'code': 'ROU', 'name': 'Romania', 'lat': 46, 'lon': 25},
            'RU': {'code': 'RUS', 'name': 'Russian Federation', 'lat': 60, 'lon': 100},
            'RW': {'code': 'RWA', 'name': 'Rwanda', 'lat': -2, 'lon': 30},
            'SH': {'code': 'SHN', 'name': 'Saint Helena, Ascension and Tristan da Cunha', 'lat': -15.9333, 'lon': -5.7},
            'KN': {'code': 'KNA', 'name': 'Saint Kitts and Nevis', 'lat': 17.3333, 'lon': -62.75},
            'LC': {'code': 'LCA', 'name': 'Saint Lucia', 'lat': 13.8833, 'lon': -61.1333},
            'PM': {'code': 'SPM', 'name': 'Saint Pierre and Miquelon', 'lat': 46.8333, 'lon': -56.3333},
            'VC': {'code': 'VCT', 'name': 'Saint Vincent and the Grenadines', 'lat': 13.25, 'lon': -61.2},
            'WS': {'code': 'WSM', 'name': 'Samoa', 'lat': -13.5833, 'lon': -172.3333},
            'SM': {'code': 'SMR', 'name': 'San Marino', 'lat': 43.7667, 'lon': 12.4167},
            'ST': {'code': 'STP', 'name': 'Sao Tome and Principe', 'lat': 1, 'lon': 7},
            'SA': {'code': 'SAU', 'name': 'Saudi Arabia', 'lat': 25, 'lon': 45},
            'SN': {'code': 'SEN', 'name': 'Senegal', 'lat': 14, 'lon': -14},
            'RS': {'code': 'SRB', 'name': 'Serbia', 'lat': 44, 'lon': 21},
            'SC': {'code': 'SYC', 'name': 'Seychelles', 'lat': -4.5833, 'lon': 55.6667},
            'SL': {'code': 'SLE', 'name': 'Sierra Leone', 'lat': 8.5, 'lon': -11.5},
            'SG': {'code': 'SGP', 'name': 'Singapore', 'lat': 1.3667, 'lon': 103.8},
            'SK': {'code': 'SVK', 'name': 'Slovakia', 'lat': 48.6667, 'lon': 19.5},
            'SI': {'code': 'SVN', 'name': 'Slovenia', 'lat': 46, 'lon': 15},
            'SB': {'code': 'SLB', 'name': 'Solomon Islands', 'lat': -8, 'lon': 159},
            'SO': {'code': 'SOM', 'name': 'Somalia', 'lat': 10, 'lon': 49},
            'ZA': {'code': 'ZAF', 'name': 'South Africa', 'lat': -29, 'lon': 24},
            'GS': {'code': 'SGS', 'name': 'South Georgia and the South Sandwich Islands', 'lat': -54.5, 'lon': -37},
            'ES': {'code': 'ESP', 'name': 'Spain', 'lat': 40, 'lon': -4},
            'LK': {'code': 'LKA', 'name': 'Sri Lanka', 'lat': 7, 'lon': 81},
            'SD': {'code': 'SDN', 'name': 'Sudan', 'lat': 15, 'lon': 30},
            'SR': {'code': 'SUR', 'name': 'Suriname', 'lat': 4, 'lon': -56},
            'SJ': {'code': 'SJM', 'name': 'Svalbard and Jan Mayen', 'lat': 78, 'lon': 20},
            'SZ': {'code': 'SWZ', 'name': 'Swaziland', 'lat': -26.5, 'lon': 31.5},
            'SE': {'code': 'SWE', 'name': 'Sweden', 'lat': 62, 'lon': 15},
            'CH': {'code': 'CHE', 'name': 'Switzerland', 'lat': 47, 'lon': 8},
            'SY': {'code': 'SYR', 'name': 'Syrian Arab Republic', 'lat': 35, 'lon': 38},
            'TW': {'code': 'TWN', 'name': 'Taiwan, Province of China', 'lat': 23.5, 'lon': 121},
            'TJ': {'code': 'TJK', 'name': 'Tajikistan', 'lat': 39, 'lon': 71},
            'TZ': {'code': 'TZA', 'name': 'Tanzania, United Republic of', 'lat': -6, 'lon': 35},
            'TH': {'code': 'THA', 'name': 'Thailand', 'lat': 15, 'lon': 100},
            'TL': {'code': 'TLS', 'name': 'Timor-Leste', 'lat': -8.55, 'lon': 125.5167},
            'TG': {'code': 'TGO', 'name': 'Togo', 'lat': 8, 'lon': 1.1667},
            'TK': {'code': 'TKL', 'name': 'Tokelau', 'lat': -9, 'lon': -172},
            'TO': {'code': 'TON', 'name': 'Tonga', 'lat': -20, 'lon': -175},
            'TT': {'code': 'TTO', 'name': 'Trinidad and Tobago', 'lat': 11, 'lon': -61},
            'TN': {'code': 'TUN', 'name': 'Tunisia', 'lat': 34, 'lon': 9},
            'TR': {'code': 'TUR', 'name': 'Turkey', 'lat': 39, 'lon': 35},
            'TM': {'code': 'TKM', 'name': 'Turkmenistan', 'lat': 40, 'lon': 60},
            'TC': {'code': 'TCA', 'name': 'Turks and Caicos Islands', 'lat': 21.75, 'lon': -71.5833},
            'TV': {'code': 'TUV', 'name': 'Tuvalu', 'lat': -8, 'lon': 178},
            'UG': {'code': 'UGA', 'name': 'Uganda', 'lat': 1, 'lon': 32},
            'UA': {'code': 'UKR', 'name': 'Ukraine', 'lat': 49, 'lon': 32},
            'AE': {'code': 'ARE', 'name': 'United Arab Emirates', 'lat': 24, 'lon': 54},
            'GB': {'code': 'GBR', 'name': 'United Kingdom', 'lat': 54, 'lon': -2},
            'US': {'code': 'USA', 'name': 'United States', 'lat': 38, 'lon': -97},
            'UM': {'code': 'UMI', 'name': 'United States Minor Outlying Islands', 'lat': 19.2833, 'lon': 166.6},
            'UY': {'code': 'URY', 'name': 'Uruguay', 'lat': -33, 'lon': -56},
            'UZ': {'code': 'UZB', 'name': 'Uzbekistan', 'lat': 41, 'lon': 64},
            'VU': {'code': 'VUT', 'name': 'Vanuatu', 'lat': -16, 'lon': 167},
            'VE': {'code': 'VEN', 'name': 'Venezuela, Bolivarian Republic of', 'lat': 8, 'lon': -66},
            'VN': {'code': 'VNM', 'name': 'Viet Nam', 'lat': 16, 'lon': 106},
            'VG': {'code': 'VGB', 'name': 'Virgin Islands, British', 'lat': 18.5, 'lon': -64.5},
            'VI': {'code': 'VIR', 'name': 'Virgin Islands, U.S.', 'lat': 18.3333, 'lon': -64.8333},
            'WF': {'code': 'WLF', 'name': 'Wallis and Futuna', 'lat': -13.3, 'lon': -176.2},
            'EH': {'code': 'ESH', 'name': 'Western Sahara', 'lat': 24.5, 'lon': -13},
            'YE': {'code': 'YEM', 'name': 'Yemen', 'lat': 15, 'lon': 48},
            'ZM': {'code': 'ZMB', 'name': 'Zambia', 'lat': -15, 'lon': 30},
            'ZW': {'code': 'ZWE', 'name': 'Zimbabwe', 'lat': -20, 'lon': 30}}
