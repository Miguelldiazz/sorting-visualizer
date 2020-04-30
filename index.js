const visualizer = document.querySelector("canvas");
var ctx = visualizer.getContext("2d");

visualizer.width = window.innerWidth;
visualizer.height = window.innerHeight * 2/3;

var width = visualizer.width;
var height = visualizer.height;

const shuffle_button = document.getElementById("shuffle");
const sort_button = document.getElementById("sort");

let arr;

const sleep_time = 1;

let bubble_option = document.getElementById("bubbleSort");
let select_option = document.getElementById("selectSort");
let merge_option = document.getElementById("mergeSort");
let quick_option = document.getElementById("quickSort");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function swap(arr, i, j) {
    let aux = arr[i];
    arr[i] = arr[j];
    arr[j] = aux;
}

function shuffle(arr) {
    for(let i = 0;i < arr.length;i++) {
        let idx = Math.floor(Math.random() * arr.length);
        swap(arr, i, idx);
    }
}

function generate_array(size) {
    let arr = [];
    for(let i = 1;i < size + 1;i++) {
        arr.push(i * (height / size));
    }
    return arr;
}

function draw_line(line, idx, color) {
    let w = width / arr.length;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.moveTo(idx * w, height);
    ctx.lineTo(idx * w, height - line);
    ctx.stroke();

}

function draw(arr, color) {
    let w = width / arr.length;
    ctx.clearRect(0, 0, visualizer.width, visualizer.height);
    for(let i = 0;i < arr.length;i++) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.moveTo(i * w, height);
        ctx.lineTo(i * w, height - arr[i]);
        ctx.stroke();
    }
}

function end() {
    draw(arr, 'green');
    sort_button.disabled = false;
    shuffle_button.disabled = false;
    array_size.disabled = false;
}

async function bubbleSort(arr) {
    for(let i = 0;i < arr.length - 1;i++) {
        draw(arr, 'black');
        await sleep(sleep_time);
        for(let j = 0;j < arr.length - 1 - i;j++) {
            draw_line(arr[j], j, 'red');
            await sleep(sleep_time);
            draw(arr, 'black');
            if(arr[j] > arr[j + 1]) {
                draw_line(arr[j + 1], j + 1, 'green');
                await sleep(sleep_time);
                swap(arr, j, j + 1);
            }
        }
    }
    end();
}

async function selectSort(arr) {
    var max;
    for(let i = arr.length;i >= 0;i--) {
        draw(arr, 'black');
        await sleep(sleep_time);
        max = i;
        for(let j = i - 1;j >= 0;j--) {
            draw_line(arr[j], j, 'red');
            await sleep(sleep_time);
            draw(arr, 'black');
            if(arr[j] > arr[max]) {
                max = j;
            }
        }
        if(max !== i) {
            draw_line(arr[max], max, 'green');
            await sleep(sleep_time);
            swap(arr, i, max);
        }
        
    }
    end();
}

async function merge(arr, l, m, r) { 
    let i, j, k; 
    let n1 = m - l + 1; 
    let n2 =  r - m; 
    
    let R = new Array(n2).fill(0);
    let L = new Array(n1).fill(0);  
    
    for (i = 0; i < n1; i++) {
        L[i] = arr[l + i];
    }         
    for (j = 0; j < n2; j++) {
        R[j] = arr[m + 1+ j]; 
    }       
        
    i = 0;
    j = 0;
    k = l;

    while (i < n1 && j < n2) { 
        draw_line(arr[k], k, 'red');
        await sleep(sleep_time);
        draw(arr, 'black');
        if (L[i] <= R[j]) { 
            draw_line(arr[k], k, 'green');
            await sleep(sleep_time);
            draw(arr, 'black');
            arr[k] = L[i]; 
            i++; 
        } else { 
            draw_line(arr[k], k, 'green');
            await sleep(sleep_time);
            draw(arr, 'black');
            arr[k] = R[j]; 
            j++; 
        } 
        k++; 
    }

    while (i < n1) { 
        draw_line(arr[k], k, 'red');
        await sleep(sleep_time);
        draw(arr, 'black');
        arr[k] = L[i]; 
        i++; 
        k++; 
    }

    while (j < n2) { 
        draw_line(arr[k], k, 'red');
        await sleep(sleep_time);
        draw(arr, 'black');
        arr[k] = R[j]; 
        j++; 
        k++; 
    } 
}

async function mergeSort(arr, l, r) { 
    draw(arr, 'black');
    await sleep(sleep_time);
    if (l < r) {
        let m = l+Math.floor((r-l)/2);
        await mergeSort(arr, l, m);
        await mergeSort(arr, m+1, r);
        await merge(arr, l, m, r);
    }
} 

async function partition (arr, low, high) { 
    let pivot = arr[high];
    let i = (low - 1); 
  
    for (let j = low; j <= high- 1; j++) { 
        draw_line(arr[i], i, 'red');
        draw_line(arr[j], j, 'red');
        await sleep(sleep_time);
        draw(arr, 'black');
        if (arr[j] < pivot) { 
            draw_line(arr[j], j, 'green');
            draw_line(arr[i], i, 'green');
            await sleep(sleep_time);
            draw(arr, 'black');
            i++;
            swap(arr, i, j); 
        } 
    } 
    swap(arr, i + 1, high); 
    return i + 1; 
}

async function quickSort(arr, low, high) { 
    if (low < high) {
        let p = await partition(arr, low, high);      
        await quickSort(arr, low, p - 1); 
        await quickSort(arr, p + 1, high); 
    } 
} 

shuffle_button.onclick = () => {
    shuffle(arr);
    draw(arr, 'black');
}

function disable_buttons() {
    sort_button.disabled = true;
    shuffle_button.disabled = true;
    array_size.disabled = true;
}

sort_button.onclick = () => {    
    if(bubble_option.checked) {
        disable_buttons();
        bubbleSort(arr);
    } else if(select_option.checked) {
        disable_buttons();
        selectSort(arr);
    } else if(merge_option.checked) {
        disable_buttons();
        mergeSort(arr, 0, arr.length - 1).then(() => {end()});
    } else if(quick_option.checked) {
        disable_buttons();
        quickSort(arr, 0, arr.length - 1).then(() => {end()});
    }
}

let array_size = document.getElementById("size");

array_size.onchange = () => {
    arr = generate_array(parseInt(array_size.value));
    shuffle(arr);
    draw(arr, 'black');
}

array_size.oninput = array_size.onchange;

arr = generate_array(parseInt(array_size.value));
shuffle(arr);
draw(arr, 'black');
