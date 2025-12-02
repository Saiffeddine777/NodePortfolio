import { passwordGenerator } from "../../Helpers/PasswordGenerator";

describe ("passwordGenerator",()=>{
    it("Should return a string of 10 chars" , ()=>{
        const password = passwordGenerator()
        expect(password).toHaveLength(10)
    })

    test ("should only contain alphanumeric characters" , ()=>{
        const result = passwordGenerator()
        const regex = /^[a-zA-Z0-9]+$/
        expect(regex.test(result)).toBe(true)
    })

    test("Should return a string" , ()=>{
        const result = passwordGenerator()
        expect(typeof result).toBe("string")
    })
    
    test ("Should return different strings most of the time" , ()=>{
        const r1 :string = passwordGenerator()
        const r2 :string = passwordGenerator()
        expect(r1).not.toBe(r2)
    })
})


