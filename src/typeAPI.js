class TypeApi {
    static get baseURL() {
        const base = window.API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000' : '');
        return base ? `${base}/project_types` : '/project_types';
    }
        

    static getTypes(container, selectorId, selectedValue){
        console.log('Fetching types from:', this.baseURL);
        return fetch(this.baseURL)
        .then(r => {
            if (!r.ok) {
                throw new Error(`HTTP error! status: ${r.status}`);
            }
            const contentType = r.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return r.text().then(text => {
                    console.error('Expected JSON but got:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response. Check API URL.');
                });
            }
            return r.json();
        })
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