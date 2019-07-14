var React = require('react');

var cE = React.createElement;

class Human extends React.Component {

    constructor(props) {
        super(props);

        this.defaultHumanProps =  {
            headFill: '#000000',
            neckFill: '#0000EF',
            shoulderRightFill:'#80FF80',
            shoulderLeftFill:'#80FF80',
            handLeftFill:"#8080FF",
            forearmLeftFill: "#808040",
            elbowLeftFill: "#06AF05",
            lowerArmLeftFill: "#E34805",
            upperArmLeftFill: "#090098",
            torsoRightFill: "#FF9903",
            torsoLeftFill: "#FF0A03",
            hipRightFill: "#FFB803",
            hipLeftFill: "#FFB8C4",
            upperLegRightFill:"#20BBFD",
            upperLegLeftFill:"#15FFFD",
            kneeRightFill: "#15FF61",
            kneeLeftFill: "#15FFCA",
            lowerLegRightFill: "#E180FF",
            lowerLegLeftFill: "#A280FF",
            footRightFill: "#5BAD2A",
            footLeftFill: "#5BD92A",
            upperArmRightFill: "#0C8CFF",
            lowerArmRightFill: "#FF4980",
            elbowRightFill: "#05B206",
            forearmRightFill: "#723D06",
            handRightFill: "#FF80C4",

            headVisible: {visibility: 'hidden'},
            neckVisible: {visibility: 'hidden'},
            shoulderRightVisible:{visibility: 'hidden'},
            shoulderLeftVisible:{visibility: 'hidden'},
            handLeftVisible:{visibility: 'hidden'},
            forearmLeftVisible: {visibility: 'hidden'},
            elbowLeftVisible: {visibility: 'hidden'},
            lowerArmLeftVisible: {visibility: 'hidden'},
            upperArmLeftVisible: {visibility: 'hidden'},
            torsoRightVisible: {visibility: 'hidden'},
            torsoLeftVisible: {visibility: 'hidden'},
            hipRightVisible: {visibility: 'hidden'},
            hipLeftVisible: {visibility: 'hidden'},
            upperLegRightVisible:{visibility: 'hidden'},
            upperLegLeftVisible:{visibility: 'hidden'},
            kneeRightVisible: {visibility: 'hidden'},
            kneeLeftVisible: {visibility: 'hidden'},
            lowerLegRightVisible: {visibility: 'hidden'},
            lowerLegLeftVisible: {visibility: 'hidden'},
            footRightVisible: {visibility: 'hidden'},
            footLeftVisible: {visibility: 'hidden'},
            upperArmRightVisible: {visibility: 'hidden'},
            lowerArmRightVisible: {visibility: 'hidden'},
            elbowRightVisible: {visibility: 'hidden'},
            forearmRightVisible: {visibility: 'hidden'},
            handRightVisible: {visibility: 'hidden'}
        };
    }

    render() {
        this.humanProps = Object.assign({}, this.defaultHumanProps, this.props);

        return cE('svg', { x:0, y:0, //width:970, height:2200,
                           viewBox:"0, 0, 970, 2200"},
                  cE('g', {id:"Layer_1"},
                     cE('path', {d: "M676,2197.325 C671.83,2195.455 665.649,2189.715 662.571,2184.857 C661.352,2182.932 659.547,2178.432 658.56,2174.857 C657.573,2171.282 655.539,2165.882 654.039,2162.857 C650.529,2155.776 647.378,2136.308 646.027,2113.357 C645.121,2097.963 644.69,2095.365 641.47,2085.857 C639.513,2080.082 637.286,2072.657 636.519,2069.357 C635.752,2066.057 634.687,2061.557 634.152,2059.357 C633.617,2057.157 632.862,2051.082 632.474,2045.857 C631.939,2038.636 630.918,2034.077 628.219,2026.857 C626.266,2021.632 624.351,2014.432 623.963,2010.857 C623.523,2006.803 621.924,2001.396 619.713,1996.49 C614.695,1985.351 614.239,1979.494 617.563,1968.857 C622.321,1953.627 621.981,1931.37 616.455,1896.357 C613.666,1878.681 605.816,1835.108 602.854,1820.857 C598.69,1800.823 597.443,1796.266 587.066,1763.198 C578.237,1735.066 577.676,1729.171 574.138,1627.357 L573.27,1602.357 L568.026,1588.865 C565.141,1581.444 561.193,1572.219 559.25,1568.365 C553.716,1557.382 546.359,1535.291 544.079,1522.809 C542.623,1514.838 541.995,1507.221 541.982,1497.392 C541.972,1489.673 541.534,1479.307 541.007,1474.357 C540.481,1469.407 539.563,1457.482 538.967,1447.857 C538.372,1438.232 537.023,1424.282 535.97,1416.857 C533.531,1399.65 522.542,1346.446 515.007,1315.357 C511.432,1300.606 508.308,1284.68 506.902,1274.034 C505.643,1264.506 504.138,1256.081 503.557,1255.312 C502.688,1254.163 501.291,1254.696 495.702,1258.311 C490.224,1261.854 487.7,1262.835 482.702,1263.363 C479.029,1263.751 475.364,1263.582 473.714,1262.948 C471.605,1262.139 470.84,1262.18 470.564,1263.118 C470.363,1263.799 469.006,1273.357 467.547,1284.357 C466.089,1295.357 463.357,1311.332 461.478,1319.857 C456.764,1341.241 451.225,1376.205 450.033,1392.105 C449.487,1399.394 448.378,1409.857 447.57,1415.357 C446.044,1425.734 443.961,1472.955 443.953,1497.357 C443.946,1518.926 442.648,1528.428 437.6,1543.857 C435.17,1551.282 431.292,1561.857 428.981,1567.357 C426.67,1572.857 423.479,1581.974 421.89,1587.617 C417.802,1602.13 417.84,1605.017 423.023,1674.426 C423.601,1682.164 424.072,1695.214 424.07,1703.426 C424.066,1724.316 422.373,1734.176 409.999,1785.357 C407.871,1794.157 405.384,1805.407 404.472,1810.357 C403.56,1815.307 401.913,1823.632 400.813,1828.857 C399.713,1834.082 398.436,1841.057 397.974,1844.357 C397.513,1847.657 396.225,1855.307 395.113,1861.357 C392.374,1876.253 390,1903.107 390,1919.185 C390,1930 390.456,1934.2 392.508,1942.289 C396.233,1956.973 396.575,1963.902 393.991,1972.357 C386.315,1997.479 384.962,2005.004 384.011,2027.857 C383.299,2044.945 382.864,2048.408 380.487,2055.857 C378.996,2060.532 376.752,2066.382 375.501,2068.857 C372.268,2075.252 370.803,2086.15 370.957,2102.661 C371.03,2110.529 370.649,2118.404 370.11,2120.161 C369.571,2121.919 367.949,2128.04 366.505,2133.764 C365.062,2139.487 362.962,2145.971 361.84,2148.171 C360.717,2150.371 359.139,2154.463 358.332,2157.264 C357.525,2160.065 355.266,2164.718 353.313,2167.604 C350.292,2172.066 349.005,2173.075 344.699,2174.354 C334.161,2177.483 325.523,2175.637 321.422,2169.378 C319.113,2165.854 319.893,2154.937 322.87,2149.107 C324.581,2145.758 324.737,2144.857 323.606,2144.857 C321.898,2144.857 315.656,2155.691 314.099,2161.357 C313.495,2163.557 312.663,2165.857 312.25,2166.467 C310.974,2168.356 305.247,2170.857 302.198,2170.857 C298.062,2170.857 292.684,2166.934 291.543,2163.085 C290.787,2160.533 290.048,2159.857 288.016,2159.857 C284.508,2159.857 281.06,2157.246 279.437,2153.359 C278.487,2151.088 277.235,2149.954 275.232,2149.553 C271.859,2148.878 270,2145.46 270,2139.932 C270,2137.579 269.359,2135.572 268.338,2134.729 C265.36,2132.27 262,2123.149 262,2117.525 C262,2111.177 267.51,2086.369 269.7,2082.857 C270.557,2081.482 272.298,2079.232 273.568,2077.857 C274.838,2076.482 277.688,2071.757 279.9,2067.357 C282.113,2062.957 287.079,2055.532 290.936,2050.857 C298.423,2041.783 300.377,2039.062 306.736,2028.857 C309.504,2024.415 311.117,2020.402 311.83,2016.184 C312.529,2012.047 315.012,2005.783 319.363,1997.184 C326.414,1983.247 327.058,1980.217 325.597,1967.857 C324.816,1961.249 325.19,1959.231 331.518,1935.889 C333.758,1927.626 333.364,1920.023 329.057,1888.357 C326.888,1872.407 324.163,1849.682 323.001,1837.857 C321.84,1826.032 320.029,1808.707 318.977,1799.357 C317.925,1790.007 316.577,1777.632 315.983,1771.857 C315.389,1766.082 313.284,1749.882 311.306,1735.857 C308.056,1712.806 307.7,1708.1 307.605,1686.857 C307.503,1664.089 307.742,1660.704 312.085,1623.357 C313.434,1611.754 315.331,1600.215 319.156,1580.357 C322.163,1564.742 322.217,1563.959 321.369,1547.857 C320.891,1538.782 320.5,1518.082 320.5,1501.857 C320.5,1469.578 321.037,1473.577 313.857,1452.357 C310.324,1441.912 306.154,1418.706 301.951,1386.095 C300.835,1377.439 298.815,1363.771 297.461,1355.721 C296.107,1347.671 295,1339.557 295,1337.69 C295,1335.823 293.899,1328.459 292.553,1321.326 C291.208,1314.193 289.181,1301.607 288.049,1293.357 C286.917,1285.107 285.312,1273.857 284.484,1268.357 C278.368,1227.77 269.882,1143.455 271.433,1138.69 C271.672,1137.957 272.114,1122.507 272.416,1104.357 C273.372,1046.893 276.577,1017.359 284.089,996.776 C290.251,979.891 292.21,963.73 292.503,927.357 C292.699,903.058 292.835,902.076 301.142,864.857 C307.094,838.188 308.391,824.531 308.457,787.857 C308.502,762.274 307.267,744.911 303.906,723.857 C300.701,703.785 300.145,703.501 297.58,720.634 C296.051,730.848 287.156,767.653 280.368,791.857 C277.97,800.406 277.684,803.208 277.511,819.857 C277.405,830.032 276.815,840.382 276.199,842.857 C274.607,849.254 265.21,876.591 262.965,881.357 C259.703,888.281 253.32,904.023 250.193,912.857 C236.303,952.091 223.265,985.011 212.766,1007.357 C198.919,1036.828 192.354,1053.282 179.051,1091.857 C170.541,1116.534 164.373,1133.993 162.977,1137.357 C162.52,1138.457 161.912,1141.382 161.625,1143.857 C161.339,1146.332 160.583,1151.732 159.946,1155.857 C159.259,1160.307 159.072,1166.407 159.486,1170.857 C161.138,1188.587 161.406,1185.832 154.483,1222.357 C150.292,1244.467 150.19,1242.228 157.042,1278.357 C158.085,1283.857 159.065,1293.456 159.219,1299.688 C159.5,1311.011 159.498,1311.022 156.694,1313.438 C155.134,1314.783 152.614,1315.857 151.017,1315.857 C146.103,1315.857 144.517,1312.501 142.089,1296.979 C140.889,1289.305 139.034,1279.973 137.967,1276.241 C136.9,1272.509 135.302,1265.515 134.417,1260.699 C132.471,1250.108 130.81,1248.103 127.462,1252.302 C126.196,1253.889 124.917,1256.576 124.619,1258.273 C124.321,1259.969 123.797,1273.957 123.455,1289.357 C122.585,1328.432 121.921,1335.39 118.756,1338.555 C115.787,1341.524 110.27,1341.919 106.477,1339.434 C103.615,1337.559 103.494,1335.925 105.054,1320.357 C105.853,1312.381 105.714,1307.355 104.366,1295.53 C102.97,1283.277 102.88,1279.372 103.845,1273.03 C105.223,1263.975 105.341,1257.857 104.137,1257.857 C103.662,1257.857 103.01,1260.669 102.687,1264.107 C102.365,1267.544 101.613,1274.632 101.018,1279.857 C100.422,1285.082 99.757,1301.199 99.539,1315.674 C99.214,1337.181 98.861,1342.42 97.605,1344.337 C94.757,1348.684 86.117,1348.807 82.254,1344.555 C80.474,1342.595 80.164,1340.242 79.398,1322.857 C78.322,1298.435 78.277,1282.047 79.267,1274.537 C79.778,1270.661 79.694,1268.928 79.017,1269.346 C78.458,1269.692 78,1271.271 78,1272.857 C78,1274.442 77.55,1276.017 77,1276.357 C76.382,1276.738 76,1285.378 76,1298.948 C76,1322.296 75.308,1326.551 71.15,1328.776 C67.509,1330.725 63.23,1330.034 59.766,1326.939 L56.5,1324.021 L55.884,1301.689 C55.545,1289.406 55.667,1275.982 56.155,1271.857 C56.642,1267.732 57.998,1256.257 59.167,1246.357 C61.431,1227.188 62.613,1207.857 61.522,1207.857 C60.837,1207.857 50.78,1216.49 43.665,1223.185 C36.514,1229.915 27.912,1232.88 15.701,1232.823 C7.486,1232.785 4,1230.881 4,1226.43 C4,1224.37 4.785,1223.49 7.75,1222.226 C17.831,1217.931 20,1216.804 20,1215.86 C20,1215.298 24.806,1210.009 30.679,1204.107 C36.552,1198.205 43.335,1190.672 45.752,1187.366 C53.513,1176.752 54.277,1175.857 55.577,1175.857 C56.28,1175.857 57.804,1174.65 58.964,1173.176 C60.123,1171.702 63.029,1169.114 65.421,1167.426 C76.239,1159.791 91.943,1145.63 94.601,1141.115 C99.206,1133.291 100.999,1129.111 101.019,1126.155 C101.036,1123.61 102.488,1117.647 108.031,1097.357 C109.083,1093.507 110.857,1087.008 111.974,1082.914 C113.091,1078.821 114.688,1071.538 115.522,1066.73 C116.356,1061.922 118.571,1053.754 120.444,1048.579 C125.885,1033.549 128.728,1019.719 136.523,970.357 C141.908,936.259 144.798,919.63 147.474,907.357 C148.793,901.307 151.289,888.257 153.019,878.357 C155.972,861.462 161.612,839.364 166.164,826.857 C167.264,823.832 169.881,816.407 171.979,810.357 C174.077,804.307 177.14,796.432 178.786,792.857 C187.39,774.174 190.819,760.049 193.958,730.357 C195.121,719.357 197.179,701.357 198.531,690.357 C205.367,634.726 205.503,632.798 205.233,594.857 C204.841,539.85 206.548,519.839 214.617,484.857 C219.263,464.711 224.227,449.477 227.974,443.861 C235.137,433.126 244.896,425.645 259.083,420.018 C266.793,416.959 270.192,415.229 280,409.365 C283.025,407.556 289.922,404.432 295.327,402.422 C318.552,393.783 373.414,367.421 387.5,358.13 C397.153,351.764 403.35,345.656 405.586,340.305 C407.755,335.113 410.005,319.121 410.515,305.262 C410.962,293.111 410.875,292.4 408.136,286.001 C402.088,271.87 398.797,260.24 395.55,241.525 C393.885,231.93 393.495,230.857 391.673,230.857 C391.008,230.857 388.731,229.679 386.612,228.239 C381.491,224.759 376.09,213.131 372.608,198.088 C369.62,185.176 369.403,180.245 371.476,172.286 C373.037,166.294 374.074,164.528 377.817,161.488 C379.817,159.863 380.04,159.043 379.451,155.482 C379.075,153.213 378.372,150.602 377.888,149.679 C377.404,148.757 376.518,142.232 375.921,135.179 C375.323,128.127 374.355,121.364 373.771,120.15 C373.018,118.586 373.033,115.092 373.824,108.15 C374.537,101.888 374.59,98.237 373.97,98.023 C372.726,97.596 372.706,94.157 373.942,93.392 C374.461,93.072 375.159,90.683 375.493,88.083 C375.828,85.484 376.529,82.575 377.051,81.62 C377.573,80.665 378,78.69 378,77.231 C378,75.772 379.427,72.278 381.171,69.467 C382.914,66.656 385.79,61.813 387.561,58.704 C390.512,53.524 399.183,42.306 407.911,32.378 C412.168,27.535 420.681,20.997 423.75,20.214 C424.987,19.898 426,19.219 426,18.705 C426,18.19 426.562,17.874 427.25,18.002 C427.937,18.129 429.914,17.899 431.642,17.49 C434.062,16.916 434.671,16.316 434.295,14.877 C433.884,13.306 434.577,12.893 438.637,12.284 C441.293,11.886 444.957,10.937 446.777,10.176 C448.598,9.416 450.538,9.071 451.088,9.411 C451.638,9.751 452.717,9.507 453.486,8.869 C454.254,8.231 457.047,7.641 459.692,7.558 C462.336,7.475 464.821,6.947 465.212,6.384 C465.682,5.71 467.605,5.957 470.847,7.109 C476.633,9.164 479.675,9.332 480.243,7.628 C480.547,6.715 481.29,6.817 483.135,8.026 C485.481,9.563 489.31,9.586 493,8.084 C493.825,7.749 495.85,7.364 497.5,7.229 C499.15,7.094 502.026,6.67 503.892,6.286 C506.222,5.807 507.075,5.927 506.615,6.67 C506.163,7.401 507.868,7.743 511.867,7.724 C518.214,7.694 522.057,9.206 525.722,13.175 C526.945,14.498 529.978,16.151 532.464,16.847 C534.949,17.542 537.999,19.12 539.241,20.352 C540.483,21.584 543.75,23.745 546.5,25.152 C554.802,29.403 562.475,37.543 577.328,57.857 C579.137,60.332 581.194,63.932 581.898,65.857 C582.602,67.782 583.835,70.59 584.64,72.097 C586.648,75.861 588.23,84.716 588.706,94.857 C589.185,105.058 589.216,103.749 588.061,122.357 C586.885,141.287 585.495,151.695 583.324,157.807 L581.617,162.613 L584.282,165.781 C587.153,169.192 591,180.212 591,185.022 C591,190.113 586.123,209.988 582.74,218.688 C580.707,223.916 578.227,228.292 576.083,230.438 C572.657,233.866 572.023,234.121 566.538,234.274 L563.577,234.357 L560.729,248.357 C556.538,268.96 556.292,270.082 555.244,273.357 C554.299,276.309 554.407,289.853 555.497,305.14 C556.335,316.88 559.564,331.437 562.408,336.29 C565.979,342.383 574.31,349.638 583.561,354.709 C622.3,375.948 659.04,393.997 681.5,402.823 C699.326,409.827 702.426,411.382 715,419.625 C729.465,429.107 740.846,438.517 745.47,444.816 C754.308,456.855 760.739,478.092 766.074,512.857 C768.138,526.309 768.317,531.258 768.541,581.357 C768.773,633.021 769.75,656.091 772.933,685.104 C778.606,736.795 781.653,758.414 785.161,771.857 C787.629,781.315 788.057,782.481 795.08,798.857 C801.272,813.293 813.594,849.858 816.984,863.857 C818.116,868.532 820.404,881.582 822.068,892.857 C823.732,904.132 826.855,924.157 829.008,937.357 C832.932,961.415 836.094,982.403 838.048,997.357 C840.084,1012.94 842.192,1025.214 844.124,1032.738 C846.348,1041.396 856.476,1073.391 861.73,1088.357 C863.661,1093.857 866.719,1103.532 868.525,1109.857 C874.398,1130.416 876.682,1135.443 883.419,1142.647 C886.764,1146.223 896.183,1154.99 904.352,1162.13 C913.51,1170.135 920.219,1176.839 921.852,1179.618 C925.025,1185.018 931.623,1193.485 938.07,1200.43 C940.66,1203.22 943.732,1207.37 944.896,1209.652 C947.962,1215.663 952.225,1220.143 958.492,1223.941 C963.363,1226.893 964,1227.657 964,1230.545 C964,1235.514 960.645,1237.263 952.381,1236.599 C942.217,1235.783 933.549,1230.98 922.25,1219.905 L913,1210.838 L913,1216.982 C913,1223.453 913.426,1226.52 917.567,1249.857 C921.778,1273.588 921.959,1275.505 921.98,1296.639 C922.003,1320.089 921.349,1322.977 915.459,1325.438 C912.157,1326.818 911.529,1326.793 908.173,1325.152 C903.257,1322.749 902.373,1319.669 901.023,1300.217 C899.349,1276.105 898.708,1271.875 895.383,1262.988 C894.072,1259.485 893,1255.097 893,1253.238 C893,1251.378 892.55,1249.857 892,1249.857 C890.512,1249.857 890.789,1256.255 892.577,1263.153 C894.579,1270.878 894.905,1290.212 893.25,1303.067 C892.562,1308.408 892,1318.58 892,1325.671 C892,1337.882 891.873,1338.701 889.609,1341.145 C886.483,1344.518 880.59,1345.668 877.099,1343.587 C872.289,1340.719 872.005,1339.031 872.344,1315.357 C872.652,1293.85 872.176,1283.533 870.041,1265.4 C868.305,1250.657 866.857,1252.469 867.619,1268.429 C868.066,1277.794 867.918,1283.599 867.173,1285.904 C865.477,1291.154 864.033,1305.797 863.688,1321.244 C863.391,1334.561 863.278,1335.213 860.951,1337.098 C857.729,1339.706 850.356,1338.899 847.664,1335.643 C845.925,1333.54 845.858,1331.159 846.396,1290.97 C846.948,1249.692 846.747,1245.857 844.029,1245.857 C843.629,1245.857 843.229,1249.747 843.141,1254.502 C843.052,1259.257 842.241,1265.895 841.338,1269.252 C840.436,1272.61 839.609,1277.607 839.502,1280.357 C839.174,1288.734 837.859,1301.148 836.89,1305.014 C835.341,1311.192 827.767,1312.104 823.662,1306.606 C820.932,1302.95 820.365,1291.137 822.138,1274.857 C823.882,1258.84 823.885,1238.904 822.145,1232.109 C821.406,1229.223 820.509,1227.042 820.151,1227.263 C819.793,1227.484 819.405,1225.459 819.289,1222.764 C819.173,1220.068 818.62,1216.159 818.06,1214.079 C814.552,1201.052 813.071,1186.668 813.283,1167.701 C813.489,1149.334 813.386,1148.144 811.25,1144.146 C810.013,1141.831 809,1139.258 809,1138.429 C809,1136.961 801.918,1120.095 786.659,1085.225 C782.537,1075.803 776.697,1061.628 773.683,1053.725 C770.669,1045.823 763.167,1027.432 757.012,1012.857 C743.041,979.773 740.402,972.933 728.461,938.857 C718.879,911.513 716.064,904.282 710.163,891.857 C706.717,884.6 697.031,858.078 695.007,850.357 C694.203,847.29 693.613,838.202 693.482,826.857 C693.289,810.289 692.99,807.364 690.616,798.857 C685.05,778.914 678.862,752.819 676.039,737.395 C673.609,724.119 670,696.527 670,691.228 C670,690.474 669.604,689.857 669.119,689.857 C668.635,689.857 667.482,694.919 666.559,701.107 C665.635,707.294 663.376,720.457 661.539,730.357 C652.023,781.634 651.177,810.275 658.156,844.857 C667.417,890.74 668.81,901.464 670.041,936.357 C670.565,951.207 671.434,965.157 671.973,967.357 C672.512,969.557 672.963,973.253 672.976,975.571 C672.994,978.643 673.505,980.057 674.863,980.783 C675.887,981.332 677.208,983.035 677.796,984.569 C678.924,987.505 681.966,1002.252 682.496,1007.357 C682.668,1009.007 683.482,1012.494 684.306,1015.107 C685.13,1017.719 685.568,1019.857 685.28,1019.857 C684.991,1019.857 685.248,1020.451 685.851,1021.178 C686.454,1021.904 686.918,1023.817 686.883,1025.427 C686.847,1027.039 687.344,1030.607 687.988,1033.357 C692.645,1053.262 694.029,1060.87 694.991,1071.857 C696.242,1086.147 697.612,1097.646 699.516,1109.857 C700.246,1114.532 701.624,1125.541 702.579,1134.323 C704.103,1148.34 704.168,1152.489 703.11,1168.323 C701.341,1194.79 696.329,1247.476 693.45,1269.857 C692.071,1280.582 690.07,1301.957 689.003,1317.357 C686.729,1350.188 678.739,1427.198 676.494,1437.921 C675.638,1442.01 674.098,1448.057 673.072,1451.357 C667.351,1469.767 664.94,1506.957 666.914,1546.357 C668.03,1568.613 668.931,1573.685 676.336,1599.357 C680.865,1615.056 687.535,1648.841 689.466,1665.857 C692.161,1689.607 691.403,1728.725 687.491,1767.857 C685.974,1783.024 684.332,1814.133 683.479,1843.857 C683.203,1853.482 682.522,1867.657 681.967,1875.357 C678.568,1922.468 678.138,1943.163 680.424,1949.641 C681.207,1951.86 681.621,1953.902 681.344,1954.179 C681.067,1954.457 681.612,1955.862 682.556,1957.302 C686.104,1962.717 688.058,1972.844 688.645,1988.857 L689.213,2004.357 L693.821,2010.357 C698.66,2016.656 706.982,2032.187 710.969,2042.357 C712.263,2045.657 713.924,2049.067 714.661,2049.936 C715.397,2050.804 716,2051.932 716,2052.442 C716,2052.953 718.061,2055.843 720.581,2058.864 C726.825,2066.352 738.82,2084.194 741.149,2089.46 C742.197,2091.829 744.104,2095.025 745.386,2096.562 C751.495,2103.881 753.983,2112.68 753.956,2126.857 C753.938,2136.243 753.647,2137.941 751.218,2142.857 C749.661,2146.008 747.432,2148.874 746,2149.568 C743.263,2150.894 742.302,2153.752 742.118,2161.107 C741.974,2166.909 739.183,2170.371 735.413,2169.424 C733.143,2168.855 733,2169.073 733,2173.115 C733,2179.173 730.854,2181.857 726.01,2181.857 C722.536,2181.857 722.1,2182.139 721.816,2184.574 C721.077,2190.925 707.534,2194.586 702.449,2189.809 L700.269,2187.761 L699.682,2190.697 C698.527,2196.473 683.487,2200.682 676,2197.325 z", fill:"#E3BBA3", fillOpacity: 0.375, id: "path2180"}),
                     cE('g',{id:"Layer_2", style: {visibility: 'hidden'}},
                        cE('g', {id:"head", style: this.humanProps.headVisible, onClick: this.humanProps.onClick},
                           cE('path', {id:"head_fill", d:"M409.464,278.881 L395.748,228.02 L380.604,213.733 L372.318,182.873 L382.318,156.585 L377.051,81.62 L406.892,39.146 L438.637,12.284 L478.327,2.286 L510.901,3.143 L539.241,20.352 L571.192,36.86 L585.193,67.149 L591.479,99.723 L587.193,138.583 L583.324,157.807 L595.765,179.158 L590.051,205.16 L581.764,226.305 L566.538,234.274 L563.763,252.593 L555.762,282.024 L409.464,278.881 z", fill: this.humanProps.headFill}),
                           cE('path', {d:"M409.464,278.881 L395.748,228.02 L380.604,213.733 L372.318,182.873 L382.318,156.585 L377.051,81.62 L406.892,39.146 L438.637,12.284 L478.327,2.286 L510.901,3.143 L539.241,20.352 L571.192,36.86 L585.193,67.149 L591.479,99.723 L587.193,138.583 L583.324,157.807 L595.765,179.158 L590.051,205.16 L581.764,226.305 L566.538,234.274 L563.763,252.593 L555.762,282.024 L409.464,278.881 z", fillOpacity:0, stroke:"#000000", strokeWidth: 5.5})
                          ),
                        cE('g', {id: "neck", style: this.humanProps.neckVisible, onClick: this.humanProps.onClick},
                           cE('path', {id:"neck_fill", d:"M408.443,282.024 L412.501,323.699 L404.385,345.66 L368.816,370.009 L426.108,394.597 L497.636,401.334 L571.36,394.423 L595.765,371.845 L557.64,322.266 L555.497,305.14 L556.446,287.653 L408.443,282.024 z", fill: this.humanProps.neckFill}),
                           cE('path', {d: "M408.443,282.024 L412.501,323.699 L404.385,345.66 L368.816,370.009 L426.108,394.597 L497.636,401.334 L571.36,394.423 L595.765,371.845 L557.64,322.266 L555.497,305.14 L556.446,287.653 L408.443,282.024 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "shoulderRight", style: this.humanProps.shoulderRightVisible, onClick: this.humanProps.onClick},
                           cE('path', {id:"shoulderRight_fill", d: "M368.816,370.009 L295.327,402.422 L227.974,443.861 L303.127,540.208 L392.858,518.625 L412.88,482.63 L467.012,409.925 L465.002,397.792 L368.816,370.009 z", fill: this.humanProps.shoulderRightFill}),
                           cE('path', {d: "M368.816,370.009 L295.327,402.422 L227.974,443.861 L303.127,540.208 L392.858,518.625 L412.88,482.63 L467.012,409.925 L465.002,397.792 L368.816,370.009 z", fillOpacity: 0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "shoulderLeft", style: this.humanProps.shoulderLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "shoulderLeft_fill", d: "M467.012,401.334 L567.364,395.697 L594.695,370.009 L728.09,430.372 L642.016,539.699 L588.424,540.208 L467.012,401.334 z", fill: this.humanProps.shoulderLeftFill}),
                           cE('path', {d: "M467.012,401.334 L567.364,395.697 L594.695,370.009 L728.09,430.372 L642.016,539.699 L588.424,540.208 L467.012,401.334 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g',{id: "handLeft", style: this.humanProps.handLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "handLeft_fill", d: "M810.077,1133.296 L819.133,1180.139 L820.695,1218.238 L827.877,1243.533 L821.632,1281.945 L826.316,1300.995 L835.129,1307.46 L840.085,1273.593 L844.029,1245.857 L847.685,1332.076 L860.951,1337.098 L868.171,1257.732 L874.944,1338.189 L889.609,1341.145 L892,1249.857 L908.812,1321.338 L920.872,1322.494 L913,1210.838 L947.471,1233.942 L964,1233.942 L964,1225.186 L946.975,1214.117 L916.742,1170.337 L879.879,1131.855 L873.32,1119.414 L810.077,1133.296 z", fill: this.humanProps.handLeftFill}),
                           cE('path', {d: "M810.077,1133.296 L819.133,1180.139 L820.695,1218.238 L827.877,1243.533 L821.632,1281.945 L826.316,1300.995 L835.129,1307.46 L840.085,1273.593 L844.029,1245.857 L847.685,1332.076 L860.951,1337.098 L868.171,1257.732 L874.944,1338.189 L889.609,1341.145 L892,1249.857 L908.812,1321.338 L920.872,1322.494 L913,1210.838 L947.471,1233.942 L964,1233.942 L964,1225.186 L946.975,1214.117 L916.742,1170.337 L879.879,1131.855 L873.32,1119.414 L810.077,1133.296 z", fillOpacity: 0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g',{id: "forearmLeft", style: this.humanProps.forearmLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "forearmLeft_fill", d: "M807.032,1132.949 L735.508,955.012 L828.688,931.552 L874.165,1114.181 L807.032,1132.949 z", fill: this.humanProps.forearmLeftFill}),
                           cE('path', {d: "M807.032,1132.949 L735.508,955.012 L828.688,931.552 L874.165,1114.181 L807.032,1132.949 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "elbowLeft", style: this.humanProps.elbowLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "elbowLeft_fill", d: "M695.867,845.651 L738.456,951.042 L826.522,926.499 L805.228,810.281 L695.867,845.651 z", fill: this.humanProps.elbowLeftFill}),
                           cE('path', {d: "M695.867,845.651 L738.456,951.042 L826.522,926.499 L805.228,810.281 L695.867,845.651 z", fillOpacity:0, stroke: "#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id:"lowerArmLeft", style: this.humanProps.lowerArmLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id:"lowerArmLeft_fill", d: "M695.867,845.651 L675.862,689.402 L772.192,657.679 L805.228,810.281 L695.867,845.651 z", fill: this.humanProps.lowerArmLeftFill}),
                           cE('path', {d: "M695.867,845.651 L675.862,689.402 L772.192,657.679 L805.228,810.281 L695.867,845.651 z", fillOpacity: 0, stroke: "#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "upperArmLeft", style: this.humanProps.upperArmLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id:"upperArmLeft_fill", d: "M675.862,685.655 L660.053,528.787 L735.508,430.372 L758.27,453.845 L774.562,651.209 L675.862,685.655 z", fill: this.humanProps.upperArmLeftFill}),
                           cE('path', {d: "M675.862,685.655 L660.053,528.787 L735.508,430.372 L758.27,453.845 L774.562,651.209 L675.862,685.655 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "torsoRight", style: this.humanProps.torsoRightVisible, onClick: this.humanProps.onClick},
                           cE('path',{id: "torsoRight_fill", d: "M303.127,975.016 L315.218,710.751 L323.492,540.208 L385.079,523.162 L475.14,401.334 L497.44,976.743 L303.127,975.016 z" , fill: this.humanProps.torsoRightFill}),
                           cE('path', {d: "M303.127,975.016 L315.218,710.751 L323.492,540.208 L385.079,523.162 L475.14,401.334 L497.44,976.743 L303.127,975.016 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "torsoLeft", style: this.humanProps.torsoLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "torsoLeft_fill", d:"M475.14,401.334 L588.424,540.208 L650,535 L668,579.5 L670,691.228 L660.053,786 L667,893 L672.976,975.571 L497.44,976.743 L475.14,401.334 z", fill: this.humanProps.torsoLeftFill}),
                           cE('path', {d: "M475.14,401.334 L588.424,540.208 L650,535 L668,579.5 L670,691.228 L660.053,786 L667,893 L672.976,975.571 L497.44,976.743 L475.14,401.334 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "hipRight", style: this.humanProps.hipRightVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "hipRight_fill", d:"M303.127,975.016 L279.299,1062.698 L270.784,1202.348 L287.814,1237.26 L497.44,1245.775 L505.804,976.743 L303.127,975.016 z" , fill: this.humanProps.hipRightFill}),
                           cE('path', {d: "M303.127,975.016 L279.299,1062.698 L270.784,1202.348 L287.814,1237.26 L497.44,1245.775 L505.804,976.743 L303.127,975.016 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "hipLeft", style: this.humanProps.hipLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "hipLeft_fill", d:"M505.804,976.743 L675.862,964.773 L709.317,1146.147 L695.867,1257.697 L497.44,1245.775 L505.804,976.743 z" , fill: this.humanProps.hipLeftFill}),
                           cE('path', {d: "M505.804,976.743 L675.862,964.773 L709.317,1146.147 L695.867,1257.697 L497.44,1245.775 L505.804,976.743 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "upperLegRight", style: this.humanProps.upperLegRightVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "upperLegRight_fill", d:"M287.814,1237.26 L475.14,1245.775 L421.89,1587.617 L319.156,1580.357 L287.814,1237.26 z" , fill: this.humanProps.upperLegRightFill}),
                           cE('path', {d: "M287.814,1237.26 L475.14,1245.775 L421.89,1587.617 L319.156,1580.357 L287.814,1237.26 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "upperLegLeft", style: this.humanProps.upperLegLeftVisible, onClick: this.humanProps.onClick},
                           cE('path',{id: "upperLegLeft_fill", d:"M505.803,1245.775 L566.627,1566.798 L675.862,1566.798 L695.867,1245.775 L505.803,1245.775 z" , fill: this.humanProps.upperLegLeftFill}),
                           cE('path', {d: "M505.803,1245.775 L566.627,1566.798 L675.862,1566.798 L695.867,1245.775 L505.803,1245.775 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "kneeRight", style: this.humanProps.kneeRightVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "kneeRight_fill", d:"M319.156,1580.357 L316.313,1724.832 L417.727,1731.271 L421.89,1587.617 L319.156,1580.357 z" , fill: this.humanProps.kneeRightFill}),
                           cE('path', {d: "M319.156,1580.357 L316.313,1724.832 L417.727,1731.271 L421.89,1587.617 L319.156,1580.357 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "kneeLeft", style: this.humanProps.kneeLeftVisible, onClick: this.humanProps.onClick},
                           cE('path',{id: "kneeLeft_fill", d:"M566.627,1566.798 L675.862,1566.798 L688.162,1720.003 L584.334,1731.271 L566.627,1566.798 z" , fill: this.humanProps.kneeLeftFill}),
                           cE('path', {d: "M566.627,1566.798 L675.862,1566.798 L688.162,1720.003 L584.334,1731.271 L566.627,1566.798 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "lowerLegRight", style: this.humanProps.lowerLegRightVisible, onClick: this.humanProps.onClick},
                           cE('path',{id: "lowerLegRight_fill", d:"M316.313,1724.832 L337.24,1956.634 L316.313,2016.999 L383.117,2035.511 L399.215,1959.049 L399.215,1875.343 L417.727,1731.271 L316.313,1724.832 z" , fill: this.humanProps.lowerLegRightFill}),
                           cE('path', {d: "M316.313,1724.832 L337.24,1956.634 L316.313,2016.999 L383.117,2035.511 L399.215,1959.049 L399.215,1875.343 L417.727,1731.271 L316.313,1724.832 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "lowerLegLeft", style: this.humanProps.lowerLegLeftVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "lowerLegLeft_fill", d:"M590.721,1731.271 L688.162,1720.003 L688.162,1940.06 L689.213,2004.357 L701.565,2028.401 L637.317,2041.021 L614.945,1982.509 L616.455,1896.357 L590.721,1731.271 z", fill: this.humanProps.lowerLegLeftFill}),
                           cE('path', {d: "M590.721,1731.271 L688.162,1720.003 L688.162,1940.06 L689.213,2004.357 L701.565,2028.401 L637.317,2041.021 L614.945,1982.509 L616.455,1896.357 L590.721,1731.271 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "footRight", style: this.humanProps.footRightVisible, onClick: this.humanProps.onClick},
                           cE('path',{id: "footRight_fill", d:"M316.313,2022.091 L259.86,2098.385 L275.232,2149.553 L302.198,2170.857 L322.87,2149.107 L328.124,2176.4 L353.364,2180.416 L382.046,2041.021 L316.313,2022.091 z" , fill: this.humanProps.footRightFill}),
                           cE('path', {d: "M316.313,2022.091 L259.86,2098.385 L275.232,2149.553 L302.198,2170.857 L322.87,2149.107 L328.124,2176.4 L353.364,2180.416 L382.046,2041.021 L316.313,2022.091 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "footLeft", style: this.humanProps.footLeftVisible, onClick: this.humanProps.onClick},
                           cE('path',{id: "footLeft_fill", d:"M631.007,2041.021 L701.565,2028.401 L757.208,2121.331 L742.118,2161.107 L709.317,2191.315 L672.976,2190.168 L639.612,2136.819 L631.007,2041.021 z" , fill: this.humanProps.footLeftFill}),
                           cE('path', {d: "M631.007,2041.021 L701.565,2028.401 L757.208,2121.331 L742.118,2161.107 L709.317,2191.315 L672.976,2190.168 L639.612,2136.819 L631.007,2041.021 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "upperArmRight", style: this.humanProps.upperArmRightVisible, onClick: this.humanProps.onClick},
                           cE('path',{id: "upperArmRight_fill" , d:"M227.974,443.862 L205.042,516.359 L204.464,663.642 L303.127,706.961 L323.492,540.208 L227.974,443.862 z" , fill: this.humanProps.upperArmRightFill}),
                           cE('path', {d: "M227.974,443.862 L205.042,516.359 L204.464,663.642 L303.127,706.961 L323.492,540.208 L227.974,443.862 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "lowerArmRight", style: this.humanProps.lowerArmRightVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "lowerArmRight_fill", d:"M204.464,663.642 L178.786,792.857 L276.084,835.906 L308.429,706.961 L204.464,663.642 z" , fill: this.humanProps.lowerArmRightFill}),
                           cE('path', {d: "M204.464,663.642 L178.786,792.857 L276.084,835.906 L308.429,706.961 L204.464,663.642 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "elbowRight", style: this.humanProps.elbowRightVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "elbowRight_fill", d:"M239.697,951.042 L280.705,835.906 L178.786,792.857 L152.482,904.494 L239.697,951.042 z" , fill: this.humanProps.elbowRightFill}),
                           cE('path', {d: "M239.697,951.042 L280.705,835.906 L178.786,792.857 L152.482,904.494 L239.697,951.042 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "forearmRight", style: this.humanProps.forearmRightVisible, onClick: this.humanProps.onClick},
                           cE('path', {id: "forearmRight_fill", d:"M152.482,904.494 L99.344,1139.57 L152.482,1148.812 L239.697,951.042 L152.482,904.494 z" , fill: this.humanProps.forearmRightFill}),
                           cE('path', {d: "M152.482,904.494 L99.344,1139.57 L152.482,1148.812 L239.697,951.042 L152.482,904.494 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          ),
                        cE('g', {id: "handRight", style: this.humanProps.handRightVisible, onClick: this.humanProps.onClick},
                           cE('path',{id:"handRight_fill", d:"M99.344,1139.57 L61.734,1172.668 L45.198,1191.684 L22.048,1212.63 L7.75,1222.227 L21.497,1227.788 L50.986,1218.417 L63.663,1205.464 L57.049,1320.113 L75.514,1325.349 L80.475,1266.096 L85.711,1341.145 L99.344,1341.145 L103.9,1254.521 L106.477,1339.434 L122.917,1335.271 L127.462,1252.302 L149.098,1313.498 L161.776,1307.986 L152.482,1242.394 L155.437,1148.812 L99.344,1139.57 z" , fill: this.humanProps.handRightFill}),
                           cE('path', {d: "M99.344,1139.57 L61.734,1172.668 L45.198,1191.684 L22.048,1212.63 L7.75,1222.227 L21.497,1227.788 L50.986,1218.417 L63.663,1205.464 L57.049,1320.113 L75.514,1325.349 L80.475,1266.096 L85.711,1341.145 L99.344,1341.145 L103.9,1254.521 L106.477,1339.434 L122.917,1335.271 L127.462,1252.302 L149.098,1313.498 L161.776,1307.986 L152.482,1242.394 L155.437,1148.812 L99.344,1139.57 z", fillOpacity:0, stroke:"#000000", strokeWidth:5.5})
                          )
                       )
                    )
                 );
    }
};

module.exports = Human;