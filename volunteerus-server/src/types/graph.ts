export class Graph<T> {
    adjacencyList: { [key: string]: T[] }
    
    constructor() {
        this.adjacencyList = {}
    }

    public addVertex(vertex): void {
        this.adjacencyList[vertex] = []
    }

    public addEdge(vertex1, vertex2): void {
        if(!this.adjacencyList[vertex1].includes(vertex2)) {
            this.adjacencyList[vertex1].push(vertex2)
        }
        if(!this.adjacencyList[vertex2].includes(vertex1)) {
            this.adjacencyList[vertex2].push(vertex1)
        }
    }

    public removeEdge(vertex1, vertex2): void {
        this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(vertex => vertex !== vertex2)
        this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(vertex => vertex !== vertex1)
    }

    public removeVertex(vertex): void {
        while(this.adjacencyList[vertex].length) {
            const adjacentVertex = this.adjacencyList[vertex].pop()
            this.removeEdge(vertex, adjacentVertex)
        }
        delete this.adjacencyList[vertex]
    }

    public printGraph(): void {
        const vertices = Object.keys(this.adjacencyList)
        for(let vertex of vertices) {
            const edges = this.adjacencyList[vertex]
            console.log(vertex, '->', edges.join(', '))
        }
    }
}

/**
 * Problem: 
 * We are given a group size and we need to form groups of the given size with the criteria that as many volunteers 
 * who indicated they are friends with each other are in the same group.
 **/

export function groupVolunteers(graph, groupSize) {
    const visited = {}
    const partitions = []
    const groups = []

    // Helper function to perform BFS starting at a given vertex
    function bfs(vertex) {
        const queue = []
        let partition = []

        // Add the starting vertex to the queue and mark it as visited
        queue.push(vertex)
        visited[vertex] = true

        // While the queue is not empty
        while (queue.length > 0) {
            const currentVertex = queue.shift()
            partition.push(currentVertex)

            // Check if the partition is full
            if (partition.length === groupSize) {
                partitions.push(partition)
                return
            }

            // For each neighbor of the current vertex
            const neighbors = graph.adjacencyList[currentVertex]

            for (let i = 0; i < neighbors.length; i++) {
                // If the neighbor has not been visited
                if (!visited[neighbors[i]]) {
                    // Add it to the queue and mark it as visited
                    queue.push(neighbors[i])
                    visited[neighbors[i]] = true
                }
            }
        }

        // If the BFS ended and the group is not full, then the group is not filled up with friends
        // So we need to add the remaining volunteers to the group
        partitions.push(partition)
    }

    // Perform BFS on each vertex
    const vertices = Object.keys(graph.adjacencyList)
    for (let vertex of vertices) {
        if (!visited[vertex]) {
            bfs(vertex)
        }
    }

    // Seperate the groups into groups of friends and groups of strangers
    let friendGroups = partitions.filter(group => group.length > 1);
    // Strangers are defined as volunteers who signed up alone
    let strangers = partitions.filter(group => group.length === 1);
    strangers = strangers.map(stranger => stranger[0])

    // Check if friend groups that are not full can be filled with strangers
    for (let i = 0; i < friendGroups.length; i++) {
        const group = friendGroups[i]
        if (group.length < groupSize) {
            const numStrangersNeeded = groupSize - group.length
            if (numStrangersNeeded <= strangers.length) {
                for (let j = 0; j < numStrangersNeeded; j++) {
                    // Randomly select strangers to fill the group
                    const randomIndex = Math.floor(Math.random() * strangers.length)
                    group.push(strangers.splice(randomIndex, 1)[0])
                }
            } else {
                // If there are not enough strangers to fill the group, then add all the strangers to the group
                for (let j = 0; j < strangers.length; j++) {
                    // Randomly select strangers to fill the group
                    const randomIndex = Math.floor(Math.random() * strangers.length)
                    group.push(strangers.splice(randomIndex, 1)[0])
                }
            }
        } else if (group.length > groupSize) {
            const extra = group.length - groupSize
            for (let j = 0; j < extra; j++) {
                strangers.push(group.pop())
            }
        }
        // Add to finalised groups
        groups.push(group)
    }

    // Add the remaining strangers into groups of the given size
    while (strangers.length > 0) {
        const group = []
        for (let i = 0; i < groupSize; i++) {
            group.push(strangers.shift())
        }
        groups.push(group)
    }

    return groups
}