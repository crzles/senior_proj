import httpx
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.drug_label import DrugLabel
from app.schemas.drug_label import DrugLabelResponse

router = APIRouter(
    prefix="/api/drugs",
    tags=["drugs"]
)

@router.get("/search")
async def search_drugs(q: str, db: Session = Depends(get_db)):
    url = "https://api.fda.gov/drug/label.json"

    params = {
        "search": f'(openfda.brand_name:"{q}" OR openfda.generic_name:"{q}")',
        "limit": 10
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Unable to retrieve drug information from openFDA."
        )
    data = response.json()
    results = data.get("results", [])

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No matching drugs found."
        )
    drug_results = []

    for result in results:
        openfda = result.get("openfda", {})

        brand_names = openfda.get("brand_name", [])
        med_name = brand_names[0] if brand_names else "Unknown"

        generic_names = openfda.get("generic_name", [])
        generic_name = generic_names[0] if generic_names else None 

        set_id = result.get("set_id")

        if not set_id:
            continue

        existing_label = db.query(DrugLabel).filter(DrugLabel.set_id == set_id).first()

        purpose_list = result.get("purpose", [])
        purpose = purpose_list[0] if purpose_list else None

        indications_list = result.get("indications_and_usage", [])
        indications = indications_list[0] if indications_list else None

        dosage_list = result.get("dosage_and_administration", [])
        dosage = dosage_list[0] if dosage_list else None

        storage_list = result.get("storage_and_handling", [])
        storage = storage_list[0] if storage_list else None

        warnings_list = result.get("warnings", [])
        warnings = warnings_list[0] if warnings_list else None

        boxed_warning_list = result.get("boxed_warning", [])
        boxed_warning = boxed_warning_list[0] if boxed_warning_list else None

        effective_time = result.get("effective_time")

        last_updated = (
            datetime.strptime(effective_time, "%Y%m%d") 
            if effective_time 
            else None
        )

        if not existing_label:
            new_label = DrugLabel(
                set_id=set_id,
                med_name=med_name,
                generic_name=generic_name,
                purpose=purpose,
                indications=indications,
                dosage=dosage,
                storage=storage,
                warnings=warnings,
                boxed_warning=boxed_warning,
                last_updated=last_updated
            )
            db.add(new_label)

        drug_results.append({
            "set_id": set_id,
            "med_name": med_name,
            "generic_name": generic_name,
            "purpose": purpose,
            "indications": indications,
            "dosage": dosage,
            "storage": storage,
            "warnings": warnings,
            "boxed_warning": boxed_warning,
            "last_updated": last_updated
        })
    db.commit()
    return drug_results


@router.get("/{set_id}", response_model=DrugLabelResponse)
async def get_drug_label(set_id: str, db: Session = Depends(get_db)):
    drug_label = db.query(DrugLabel).filter(DrugLabel.set_id == set_id).first()

    if not drug_label:
        raise HTTPException(
            status_code=404,
            detail="Drug label not found."
        )
    return drug_label
