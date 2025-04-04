import {
    ApexAnnotations,
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexFill,
    ApexGrid,
    ApexLegend,
    ApexMarkers,
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    ApexStroke,
    ApexTheme,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexYAxis,
} from "ng-apexcharts";

export type ChartOptions = {
    series?: ApexAxisChartSeries;
    chart?: ApexChart;
    xaxis?: ApexXAxis;
    stroke?: ApexStroke;
    tooltip?: any;
    dataLabels?: ApexDataLabels;
    hover?: number;
    yaxis?: ApexYAxis;
    legend?: ApexLegend;
    labels?: string[];
    plotOptions?: ApexPlotOptions;
    fill?: ApexFill;
    responsive?: ApexResponsive[];
    pieseries?: ApexNonAxisChartSeries;
    title?: ApexTitleSubtitle;
    theme?: ApexTheme;
    colors?: string[];
    markers?: ApexMarkers;
    annotations?: ApexAnnotations;
    grid?: ApexGrid;
};

export let TotalSale: ChartOptions | any = {
    series: [
        {
            name: '',
            data: [30, 29.31, 29.7, 29.7, 31.32, 31.65, 31.13, 29.8, 31.79, 31.67, 32.39, 30.63, 32.89, 31.99, 31.23, 31.57, 30.84, 31.07, 31.41, 31.17, 34, 34.50, 34.50, 32.53, 31.37, 32.43, 32.44, 30.2,
                30.14, 30.65, 30.4, 30.65, 31.43, 31.89, 31.38, 30.64, 31.02, 30.33, 32.95, 31.89, 30.01, 30.88, 30.69, 30.58, 32.02, 32.14, 30.37, 30.51, 32.65, 32.64, 32.27, 32.1, 32.91, 30.65, 30.8, 31.92
            ],
        },
    ],
    chart: {
        type: 'area',
        height: 92,
        offsetY: -10,
        offsetX: 0,
        animations: { enabled: false },
        zoom: { enabled: false },
        toolbar: { show: false },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    grid: {
        show: false,
        borderColor: '#dedbdb',
        padding: {
            top: 5,
            right: 0,
            bottom: -30,
            left: 0,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false,
    },
    colors: ['#ef3f3e'],
    xaxis: {
        labels: {
            show: false,
        },
        tooltip: {
            enabled: false,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        opposite: false,
        min: 29,
        max: 35,
        logBase: 100,
        tickAmount: 4,
        forceNiceScale: false,
        floating: false,
        decimalsInFloat: undefined,
        labels: {
            show: false,
            offsetX: -12,
            offsetY: -15,
            rotate: 0,
        },
    },
    legend: {
        horizontalAlign: 'left',
    },
    heading: 'Total Sale',
    price: '$254.90',
    id: 'daily-value'
}

export let TotalProfit: ChartOptions | any = {
    series: [
        {
            name: '',
            data: [30, 32.31, 31.47, 30.69, 29.32, 31.65, 31.13, 31.77, 31.79, 31.67, 32.39, 32.63, 32.89, 31.99, 31.23, 31.57, 30.84, 31.07, 31.41, 31.17, 32.37, 32.19, 32.51, 32.53, 31.37, 30.43, 30.44, 30.2,
                30.14, 30.65, 30.4, 30.65, 31.43, 31.89, 31.38, 30.64, 30.02, 30.33, 30.95, 31.89, 31.01, 30.88, 30.69, 30.58, 32.02, 32.14, 32.37, 32.51, 32.65, 32.64, 32.27, 32.1, 32.91, 33.65, 33.8, 33.92
            ],
        },
    ],
    chart: {
        type: 'area',
        height: 92,
        offsetY: -10,
        offsetX: 0,
        toolbar: {
            show: false,
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    grid: {
        show: false,
        borderColor: '#dedbdb',
        padding: {
            top: 5,
            right: 0,
            bottom: -30,
            left: 0,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 80, 100]
        }
    },
    dataLabels: {
        enabled: false,
    },
    colors: ['#277d2a'],
    xaxis: {
        labels: {
            show: false,
        },
        tooltip: {
            enabled: false,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        opposite: false,
        min: 29,
        max: 35,
        logBase: 100,
        tickAmount: 4,
        forceNiceScale: false,
        floating: false,
        decimalsInFloat: undefined,
        labels: {
            show: false,
            offsetX: -12,
            offsetY: -15,
            rotate: 0,
        },
    },
    legend: {
        horizontalAlign: 'left',
    },
    heading: 'Total Profit',
    price: '$254.90ssss',
    id: 'order-value'

}

export let CustomerRate: ChartOptions | any = {
    series: [
        {
            name: '',
            data: [30, 29.31, 29.7, 29.7, 31.32, 31.65, 31.13, 29.8, 31.79, 31.67, 32.39, 30.63, 32.89, 31.99, 31.23, 31.57, 30.84, 31.07, 31.41, 31.17, 34, 34.50, 34.50, 32.53, 31.37, 32.43, 32.44, 30.2,
                30.14, 30.65, 30.4, 30.65, 31.43, 31.89, 31.38, 30.64, 31.02, 30.33, 32.95, 31.89, 30.01, 30.88, 30.69, 30.58, 32.02, 32.14, 30.37, 30.51, 32.65, 32.64, 32.27, 32.1, 32.91, 30.65, 30.8, 31.92
            ],
        },
    ],
    chart: {
        type: 'area',
        height: 92,
        offsetY: -10,
        offsetX: 0,
        animations: { enabled: false },
        zoom: { enabled: false },
        toolbar: { show: false },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    grid: {
        show: false,
        borderColor: '#dedbdb',
        padding: {
            top: 5,
            right: 0,
            bottom: -30,
            left: 0,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false,
    },
    colors: ["#cc3300"],
    xaxis: {
        labels: {
            show: false,
        },
        tooltip: {
            enabled: false,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        opposite: false,
        min: 29,
        max: 35,
        logBase: 100,
        tickAmount: 4,
        forceNiceScale: false,
        floating: false,
        decimalsInFloat: undefined,
        labels: {
            show: false,
            offsetX: -12,
            offsetY: -15,
            rotate: 0,
        },
    },
    legend: {
        horizontalAlign: 'left',
    },
    heading: 'Customer rate',
    price: '5.12%',
    id: 'admissionRatio'
}

export let optionsEarning: ChartOptions | any = {
    series: [
        {
            data: [20, 40, 60, 20, 100, 60, 20, 80, 40, 10, 80, 100, 100],
        },
    ],
    chart: {
        type: "line",
        height: 134,
        animations: { enabled: false },
        zoom: { enabled: false },
        toolbar: { show: false },
        dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 20,
            color: "#ef3f3e",
            opacity: 0.3,
        },
    },
    grid: {
        show: true,
        borderColor: "#f5f5f5",
        strokeDashArray: 6,
        position: "back",
        xaxis: {
            lines: {
                show: true,
            },
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    },
    stroke: {
        curve: "stepline",
        width: 2,
    },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        labels: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        tooltip: {
            enabled: false,
        },
    },
    yaxis: {
        labels: {
            show: false,
        },
        min: 0,
        tickAmount: 5,
        tickPlacement: "between",
    },
    markers: {
        size: 4,
        colors: "#fff",
        strokeColors: "#ef3f3e",
        strokeWidth: 2,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        shape: "circle",
        offsetX: 2,
        offsetY: 2,
        radius: 2,
        hover: {
            size: 3,
        },
    },
    colors: ["#ef3f3e"],
    responsive: [
        {
            breakpoint: 1750,
            options: {
                chart: {
                    height: 150,
                },
            },
        },
        {
            breakpoint: 1650,
            options: {
                chart: {
                    height: 170,
                },
            },
        },
        {
            breakpoint: 1550,
            options: {
                chart: {
                    height: 180,
                },
            },
        },
        {
            breakpoint: 1410,
            options: {
                chart: {
                    height: 190,
                },
            },
        },
        {
            breakpoint: 1400,
            options: {
                chart: {
                    height: 110,
                },
            },
        },
        {
            breakpoint: 1200,
            options: {
                chart: {
                    height: 122,
                },
            },
        },
        {
            breakpoint: 768,
            options: {
                chart: {
                    height: 160,
                },
            },
        },
    ],
};

export interface category {
    id: number;
    image_url: string;
    category: string;
}
export const MenuCategory: category[] = [
    {
        id: 1,
        image_url: 'assets/images/product/1.png',
        category: 'Pizza'
    },
    {
        id: 2,
        image_url: 'assets/images/product/2.png',
        category: 'Chicken'
    },
    {
        id: 3,
        image_url: 'assets/images/product/3.png',
        category: 'Burger'
    },
    {
        id: 4,
        image_url: 'assets/images/product/4.png',
        category: 'Fries'
    },
    {
        id: 5,
        image_url: 'assets/images/product/5.png',
        category: 'Boritto'
    },
    {
        id: 6,
        image_url: 'assets/images/product/6.png',
        category: 'Taco'
    },
    {
        id: 7,
        image_url: 'assets/images/product/7.png',
        category: 'Muffin'
    },
    {
        id: 8,
        image_url: 'assets/images/product/8.png',
        category: 'Meat'
    },
    {
        id: 9,
        image_url: 'assets/images/product/9.png',
        category: 'Panner'
    },
    {
        id: 10,
        image_url: 'assets/images/product/10.png',
        category: 'Hotdog'
    },
    {
        id: 11,
        image_url: 'assets/images/product/11.png',
        category: 'Donuts'
    },
    {
        id: 12,
        image_url: 'assets/images/product/12.png',
        category: 'Coffee'
    },
    {
        id: 13,
        image_url: 'assets/images/product/13.png',
        category: 'Sandwich'
    },
    {
        id: 14,
        image_url: 'assets/images/product/14.png',
        category: 'Noddle'
    },
    {
        id: 15,
        image_url: 'assets/images/product/15.png',
        category: 'Pasta'
    },
    {
        id: 16,
        image_url: 'assets/images/product/16.png',
        category: 'Meggi'
    },
    {
        id: 17,
        image_url: 'assets/images/product/17.png',
        category: 'Momos'
    },
    {
        id: 18,
        image_url: 'assets/images/product/18.png',
        category: 'Salad'
    },
    {
        id: 19,
        image_url: 'assets/images/product/19.png',
        category: 'Biryani'
    },
]

export const OrderReport = [
    {
        id: 1,
        image_url: 'assets/images/dashboard/product-2/1.jpg',
        order_name: 'Fish Burger',
        customer: 'Jessica Taylor',
        date: '25/10/2024',
        price: '30.00',
        status: 'pending'
    },
    {
        id: 2,
        image_url: 'assets/images/dashboard/product-2/2.jpg',
        order_name: 'Pepperoni Pizza',
        customer: 'Jane Cooper',
        date: '20/01/2024',
        price: '57.00',
        status: 'completed'
    },
    {
        id: 3,
        image_url: 'assets/images/dashboard/product-2/3.jpg',
        order_name: 'Hot Dog',
        customer: 'Olivia Anderson',
        date: '18/10/2024',
        price: '40.00',
        status: 'pending'
    },
    {
        id: 4,
        image_url: 'assets/images/dashboard/product-2/4.jpg',
        order_name: 'Nachos',
        customer: 'Sophia Garcia',
        date: '02/08/2024',
        price: '30.25',
        status: 'completed'
    },
    {
        id: 5,
        image_url: 'assets/images/dashboard/product-2/5.jpg',
        order_name: 'Beef Burger',
        customer: 'Michael Smith',
        date: '05/05/2024',
        price: '50.00',
        status: 'pending'
    },
    {
        id: 6,
        image_url: 'assets/images/dashboard/product-2/6.jpg',
        order_name: 'Japanese Ramen',
        customer: 'David Wilson',
        date: '26/07/2024',
        price: '71.010',
        status: 'completed'
    },
]

export const TrendingOrders = [
    {
        id: 1,
        image_url: 'assets/images/dashboard/product/1.jpg',
        order_name: 'Poultry Palace',
        price: '20.00',
        description: 'Healthy Foods are nutrient-Dense Foods',
        rating: 4.5,
        total_sale: 200,
        marquee: [
            {
                text: 'Top Of Them Month',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Month',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Month',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Month',
                gif: 'assets/images/dashboard/round.gif'
            },
        ]
    },
    {
        id: 2,
        image_url: 'assets/images/dashboard/product/2.jpg',
        order_name: 'Wing Mastern',
        price: '30.00',
        description: 'Nutrient-dense with healthy choices',
        rating: 4.5,
        total_sale: 200,
        marquee: [
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
        ]
    },
    {
        id: 3,
        image_url: 'assets/images/dashboard/product/3.jpg',
        order_name: 'Burger Barn',
        price: '20.00',
        description: 'offering numerous health benefits prevention.',
        rating: 4.5,
        total_sale: 200,
        marquee: [
            {
                text: 'Top Of Them Year',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Year',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Year',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Year',
                gif: 'assets/images/dashboard/round.gif'
            },
        ]
    },
    {
        id: 4,
        image_url: 'assets/images/dashboard/product/4.jpg',
        order_name: 'Poultry Palace',
        price: '15.00',
        description: 'Healthy Foods are nutrient-Dense Foods.',
        rating: 4.5,
        total_sale: 250,
        marquee: [
            {
                text: 'Top Of Them Year',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Year',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Year',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Year',
                gif: 'assets/images/dashboard/round.gif'
            },
        ]
    },
    {
        id: 5,
        image_url: 'assets/images/dashboard/product/5.jpg',
        order_name: 'Mushroom',
        price: '20.00',
        description: 'Eggs are a nutrient powerhouse overall health.',
        rating: 4.5,
        total_sale: 200,
        marquee: [
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
        ]
    },
    {
        id: 6,
        image_url: 'assets/images/dashboard/product/6.jpg',
        order_name: 'Ribeye Junction',
        price: '20.00',
        description: 'Healthy Foods are nutrient-Dense Foods',
        rating: 4.5,
        total_sale: 200,
        marquee: [
            {
                text: 'Top Of Them Month',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Month',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Month',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Month',
                gif: 'assets/images/dashboard/round.gif'
            },
        ]
    },
    {
        id: 7,
        image_url: 'assets/images/dashboard/product/7.jpg',
        order_name: 'Latte Lounge',
        price: '20.00',
        description: 'Healthy Foods are nutrient-Dense Foods',
        rating: 4.5,
        total_sale: 200,
        marquee: [
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
            {
                text: 'Top Of Them Week',
                gif: 'assets/images/dashboard/round.gif'
            },
        ]
    }
]