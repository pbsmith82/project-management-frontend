class TypeApi {

    static baseURL = 'http://localhost:3000/project_types'
        

    static getTypes(event){
        fetch(this.baseURL)
        .then(r => r.json())
        .then( json => {
                json["data"].forEach(element => {
                    const type = new Type({id: element.id, ...element.attributes})
                        type.addToDropDown(event) 
                })
        })
    }

}