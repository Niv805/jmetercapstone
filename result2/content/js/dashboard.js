/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.99782637047342, "KoPercent": 0.0021736295265834893};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.885414974825402, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9420814479638009, 500, 1500, "http://localhost:1080/cgi-bin/welcome.pl?signOff=true"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:1080/webtours/header.html"], "isController": false}, {"data": [0.9417713760343243, 500, 1500, "http://localhost:1080/cgi-bin/nav.pl?page=menu&in=flights"], "isController": false}, {"data": [0.9373464373464373, 500, 1500, "http://localhost:1080/cgi-bin/reservations.pl?page=welcome"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.9346036585365853, 500, 1500, "http://localhost:1080/cgi-bin/login.pl?intro=true"], "isController": false}, {"data": [0.9425252216447569, 500, 1500, "http://localhost:1080/cgi-bin/welcome.pl?page=search"], "isController": false}, {"data": [0.9371668716687167, 500, 1500, "http://localhost:1080/cgi-bin/reservations.pl"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:1080/WebTours/home.html"], "isController": false}, {"data": [0.9462908011869436, 500, 1500, "http://localhost:1080/webtours/"], "isController": false}, {"data": [0.9347957639939486, 500, 1500, "http://localhost:1080/cgi-bin/nav.pl?in=home"], "isController": false}, {"data": [0.9431956257594167, 500, 1500, "http://localhost:1080/cgi-bin/login.pl"], "isController": false}, {"data": [0.9364548494983278, 500, 1500, "http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 46006, 1, 0.0021736295265834893, 340.98808851019487, 0, 11734, 285.0, 378.0, 407.0, 474.0, 76.70108317814504, 130.630483776919, 47.22943900162385], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://localhost:1080/cgi-bin/welcome.pl?signOff=true", 3315, 0, 0.0, 331.58039215686296, 58, 1706, 269.0, 593.0, 894.3999999999996, 1245.1200000000026, 5.5280496407184625, 5.531441811545203, 3.0177536612906453], "isController": false}, {"data": ["http://localhost:1080/webtours/header.html", 3315, 0, 0.0, 1.1369532428355937, 0, 118, 1.0, 1.0, 1.0, 20.0, 5.53028141875491, 5.43659657212221, 2.9595646655055576], "isController": false}, {"data": ["http://localhost:1080/cgi-bin/nav.pl?page=menu&in=flights", 3263, 0, 0.0, 387.4713453876804, 112, 1691, 327.0, 557.1999999999998, 979.1999999999989, 1284.0800000000004, 5.479346239939279, 9.356673700040638, 2.985815626841912], "isController": false}, {"data": ["http://localhost:1080/cgi-bin/reservations.pl?page=welcome", 3256, 0, 0.0, 418.4932432432439, 153, 1721, 353.0, 596.3000000000002, 1034.1499999999996, 1338.579999999999, 5.474596761311953, 24.16311053271391, 2.988573817942756], "isController": false}, {"data": ["Test", 3250, 1, 0.03076923076923077, 4519.20799999999, 2768, 22556, 3633.0, 5348.5, 11308.749999999996, 18389.839999999975, 5.418147627018052, 129.63437219715055, 46.75638684990564], "isController": true}, {"data": ["http://localhost:1080/cgi-bin/login.pl?intro=true", 3280, 0, 0.0, 400.13414634146255, 115, 1584, 334.0, 664.9000000000001, 972.8499999999995, 1319.5700000000002, 5.495849628192368, 6.191643905178163, 2.9518723588923854], "isController": false}, {"data": ["http://localhost:1080/cgi-bin/welcome.pl?page=search", 3271, 0, 0.0, 366.2335677162943, 79, 1532, 306.0, 598.0, 921.3999999999996, 1247.119999999999, 5.487665754012992, 4.515752896291338, 2.963553869110532], "isController": false}, {"data": ["http://localhost:1080/cgi-bin/reservations.pl", 9756, 1, 0.01025010250102501, 413.70879458794514, 138, 1713, 349.0, 579.0, 1044.0, 1335.4300000000003, 16.43439633578322, 39.29492902443513, 13.575696508301425], "isController": false}, {"data": ["http://localhost:1080/WebTours/home.html", 3294, 0, 0.0, 56.76259866423802, 0, 200, 56.0, 64.0, 67.0, 90.0, 5.506004118638175, 8.918460426535631, 3.0863734024397584], "isController": false}, {"data": ["http://localhost:1080/webtours/", 3370, 0, 0.0, 440.7362017804161, 0, 11734, 56.0, 70.0, 2420.199999999986, 10611.539999999999, 5.619036026857992, 3.636469901579333, 2.9467015101784586], "isController": false}, {"data": ["http://localhost:1080/cgi-bin/nav.pl?in=home", 3305, 0, 0.0, 395.5068078668686, 115, 1625, 331.0, 665.0000000000005, 978.0, 1246.8200000000002, 5.515880897027432, 9.449125842924236, 3.1134562094549376], "isController": false}, {"data": ["http://localhost:1080/cgi-bin/login.pl", 3292, 0, 0.0, 342.12120291616037, 74, 1583, 280.0, 579.1000000000008, 900.6999999999998, 1227.5600000000013, 5.505919030208965, 5.563085066616268, 3.914364310539185], "isController": false}, {"data": ["http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 3289, 0, 0.0, 396.8999695956222, 66, 1679, 329.0, 663.0, 1028.5, 1313.1, 5.505477858404265, 9.401421238000184, 2.983925987709343], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1, 100.0, 0.0021736295265834893], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 46006, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://localhost:1080/cgi-bin/reservations.pl", 9756, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
