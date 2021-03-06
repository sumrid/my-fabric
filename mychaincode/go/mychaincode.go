package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type User struct {
	StdID  string `json:"stdID"`
	Name   string `json:"name"`
	Tel    string `json:"tel"`
	Status bool   `json:"status"`
}
type Wallet struct {
	WalletName string  `json:"walletName"`
	Money      float64 `json:"money"`
	Owner      string  `json:"owner"`
}

type Chaincode struct {
}

func (C *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	fmt.Println("Init chaincode success.")
	return shim.Success([]byte("Init Success"))
}

func (C *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

	if fn == "query" {
		return C.query(stub, args)
	} else if fn == "createUser" {
		return C.createUser(stub, args)
	} else if fn == "createWallet" {
		return C.createWallet(stub, args)
	} else if fn == "query2" {
		return C.query2(stub, args)
	}

	fmt.Println("invoke did not find func: " + fn)
	return shim.Error("Received unknown function " + fn)
}

func (C *Chaincode) query(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	var key string // Entities
	var err error

	// Check arguments
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	key = args[0]

	// Get the state from the ledger
	Avalbytes, err := stub.GetState(key)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error!!\":\"Nil amount for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := "{\"Name\":\"" + key + "\",\"Amount\":\"" + string(Avalbytes) + "\"}"
	fmt.Printf("Query Response:%s\n", jsonResp)
	return shim.Success(Avalbytes)
}

func (C *Chaincode) createUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// Check arguments
	if len(args) != 4 {
		return shim.Error("Incorrect arguments, Want 4 input.")
	}

	// Create user object
	id := strings.ToLower(args[0])
	name := strings.ToLower(args[1])
	tel := strings.ToLower(args[2])
	status, err := strconv.ParseBool(args[3])
	if err != nil {
		return shim.Error("Arguments 4 must be 'boolean'" + err.Error())
	}

	// Key for query
	key := "stdID|" + id

	// Check if User already exists
	ck, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	} else if ck != nil {
		fmt.Println("This user already exists :" + args[0])
		return shim.Error("This user already exists")
	}

	// To JSON byte
	user := &User{id, name, tel, status}
	jsonByte, err := json.Marshal(user)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Save key-value
	err = stub.PutState(key, jsonByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return
	fmt.Println("Create user success. user key: " + key)
	return shim.Success(jsonByte)
}

func (C *Chaincode) createWallet(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// Check arguments
	if len(args) != 3 {
		return shim.Error("Incorrect arguments, Want 3 input.")
	}

	// Create object
	walletName := strings.ToLower(args[0])
	money, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		fmt.Sprintln("Arguments 2 must be number. : " + err.Error())
		return shim.Error("Arguments 2 must be number. : " + err.Error())
	}
	owner := strings.ToLower(args[2])
	wallet := Wallet{walletName, money, owner}

	// Key for query
	key := "wallet|" + walletName

	// Check if already
	ck, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	} else if ck != nil {
		fmt.Println("This wallet already exists :" + args[0])
		return shim.Error("This wallet already exists :" + args[0])
	}

	// To JSON byte
	jsonByte, err := json.Marshal(&wallet)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Save key-value
	err = stub.PutState(key, jsonByte)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Return
	fmt.Println("Create wallet success. wallet key: " + key)
	return shim.Success(jsonByte)
}

func (C *Chaincode) query2(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("ต้องการหนึ่งอินพุท")
	}

	queryString := args[0]
	interator, err := stub.GetQueryResult(queryString)
	defer interator.Close()
	if err != nil {
		return shim.Error(err.Error())
	}

	var results []string
	for interator.HasNext() {
		result, err := interator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// เพิ่มผลลัพธ์ลงไปใน list
		results = append(results, string(result.Value))
	}

	// Convert to byte
	resultsByte, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(resultsByte)
}

func main() {
	err := shim.Start(new(Chaincode))
	if err != nil {
		fmt.Printf("Error start chaincode: %s", err)
	}
}
