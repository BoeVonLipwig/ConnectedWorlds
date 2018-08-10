import sys
import csv
from os import listdir
from os.path import isfile, join

ID = 1
# keys = []
# everyNodeName = []

class Node:
    # webLink -> "hdawuidhaw.com"
    # bio -> "adawoiudoiudb"
    def __init__(self, id, name, fields):
        self.id = id
        self.name = name
        self.fields = fields

    def equals(self, other):
        return self.name == other.name

    def __repr__(self):
        return "ID: %d \nName: %s\nFields: %s\n\n" % (self.id,self.name,self.fields)


class Edge:
    def __init__(self, id, node1, node2):
        self.id = id
        self.node1 = node1
        self.node2 = node2

    def equals(self, other):
        return (self.node1 == other.node1 and self.node2 == other.node2) or (self.node1 == other.node2 and self.node2 == other.node1)

    def __repr__(self):
        return "ID: %d\nNode1: %s\nNode2: %s\n\n" % (self.id,self.node1,self.node2)


def getFileNames():
    specialFiles = getFileNamesFromDirectory("data/specialNodes")
    nodeFiles = getFileNamesFromDirectory("data/nodes")
    views = getFileNamesFromDirectory("data")
    return specialFiles,nodeFiles,views


def extractFileIntoList(file,path):
    with open(path+file,'r') as f:
        reader = csv.reader(f)
        instances = list(reader)
    return instances[1:], instances[0]


def createNodesFromFile(file,path):
    nodes = list()
    global ID

    # specialNodeFileNameList = [schools.csv, projects.csv]
    #
    # specialNameToListOfSpecialNodesMap = {}
    #
    # specialPeople = ["will"]
    #
    # for every special file
    #     name = name of file, e.g. schools.csv -> schools
    #     keys.add(name);
    #     dataFromfile = load...()
    #     specialNodes.put(name, dataFromfile)
    #
    # roles = loadlist in teaching
    # keys.add(roles)
    #
    # everyNodeName = getAllNamesFromNodesCsv("data/nodes/nodes.csv")
    # generalNodes = loadGeneralNodes("data/nodes/nodes.csv")
    #
    # #collect in to one list
    # nodes = generalNodes.join(specialMap.getEveryValueItemFromEveryKey)
    #
    # return nodes


    instances,metaData = extractFileIntoList(file,path)
    for i in instances:
        name = i[0]
        fields = dict(zip(metaData[1:], i[1:]))
        nodes.append(Node(ID,name,fields))
        ID+=1

    print(metaData)
    print(nodes[0])

# def createEdges():
    # filename = nodes.csv
    #
    # // go thro



def createNodes(fn,path):
    # check if we have more than one file
    if type(fn) is list:
        for file in fn:
            createNodesFromFile(file,path)
    else:
        createNodesFromFile(fn,path)


def loadData():
    special,nodes,views = getFileNames()
    # print(nodes[0])
    specialNodes = createNodes(special,'data/specialNodes/')
    normalNodes = createNodes(nodes[0],'data/nodes/')
    # edges = createEdges(specialNodeFileNameList

    # check validity of data


    # Create edge objects


def formatForCytoscape():
    print("stub")


def generateOutputFile():
    print("stub")


def getFileNamesFromDirectory(dir):
    onlyfiles = [f for f in listdir(dir) if isfile(join(dir, f))]
    return onlyfiles


if __name__ == '__main__':
    loadData()
    # formatForCytoscape()
    # generateOutputFile()
