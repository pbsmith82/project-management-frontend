class TypeApi {

    static baseURL = 'http://localhost:3000/project_types'
        

    static getTypes(container, selectorId, selectedValue){
        fetch(this.baseURL)
        .then(r => r.json())
        .then( json => {
                json["data"].forEach(type => {
                    const t = new Type({id: type.id, ...type.attributes})
                    // If no container/selectorId provided, use for filter dropdown
                    if (!container && !selectorId) {
                        t.addType(null, null, null)
                    } else {
                        t.addType(container, selectorId, selectedValue)
                    }
                })
        })
    }

}