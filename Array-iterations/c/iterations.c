#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define ARRAY_SIZE 1000000

// Create a large array for testing
int testArray[ARRAY_SIZE];

// Initialize the array with values
void initializeArray() {
    for (int i = 0; i < ARRAY_SIZE; i++) {
        testArray[i] = i;
    }
}

// Benchmark function
double benchmark(void (*func)(), const char* title) {
    clock_t start = clock();
    func();
    clock_t end = clock();
    double time_ms = ((double)(end - start)) / CLOCKS_PER_SEC * 1000.0;
    printf("%s: %.3fms\n", title, time_ms);
    return time_ms;
}

// Looping methods
void forLoop() {
    long long sum = 0;
    for (int i = 0; i < ARRAY_SIZE; i++) {
        sum += testArray[i];
    }
}

void whileLoop() {
    long long sum = 0;
    int i = 0;
    while (i < ARRAY_SIZE) {
        sum += testArray[i];
        i++;
    }
}

void doWhileLoop() {
    long long sum = 0;
    int i = 0;
    do {
        sum += testArray[i];
        i++;
    } while (i < ARRAY_SIZE);
}

// Main function
int main() {
    initializeArray();

    // Benchmark each method
    double forLoopTime = benchmark(forLoop, "For Loop");
    double whileLoopTime = benchmark(whileLoop, "While Loop");
    double doWhileLoopTime = benchmark(doWhileLoop, "Do-While Loop");

    // Find the fastest result
    double fastestTime = forLoopTime;
    const char* fastestMethod = "For Loop";

    if (whileLoopTime < fastestTime) {
        fastestTime = whileLoopTime;
        fastestMethod = "While Loop";
    }

    if (doWhileLoopTime < fastestTime) {
        fastestTime = doWhileLoopTime;
        fastestMethod = "Do-While Loop";
    }

    // Print the fastest result in color
    printf("\033[1;32m%s: %.3fms\033[0m\n", fastestMethod, fastestTime);

    return 0;
}
