{
    "key": "test-key",
    "client_id": "${KC_CLIENT_ID}",

    "template": {
        "ga4gh_passport_v1": {
            "ga4gh_visa_v1": {
                "type": "ControlledAccessGrants",
                "value": {
                    "dataset123": {
                        "access": "{{identity.entity.metadata.dataset123}}"
                    },
                    "dataset321": {
                        "access": "{{identity.entity.metadata.dataset321}}"
                    }
                }
            }
        }
    }
    
}