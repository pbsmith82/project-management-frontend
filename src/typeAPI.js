class TypeApi {
    static get baseURL() {
        const base = window.API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : '');
        return base ? `${base}/project_types` : '/project_types';
    }
        

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