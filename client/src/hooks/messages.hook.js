import {useCallback} from 'react'

export const useMessage = () => {
    return useCallback(text => {
        if (window.M && text) {
            window.M.toast({
                html: text,
                classes: 'position-absolute top-0 end-0 m-3 p-3'
            })
        }
    },[])
}
