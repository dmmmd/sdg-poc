import {GoalImpactRecordModel} from '../../goal/GoalImpactRecordModel';
import {IMPACT_POSITIVE_IMBALANCE, ORDER_OF_MAGNITUDE, STRONG_ORDER_OF_MAGNITUDE} from '../../goal/impactCalculator';

export async function seed(): Promise<void> {
    await GoalImpactRecordModel.knex().raw(`
        INSERT INTO impact_params (id, magnitude, "strongMagnitude", "positiveImbalance")
        VALUES (true, :magnitude, :strongMagnitude, :positiveImbalance)
        ON CONFLICT (id) DO UPDATE
            SET magnitude           = EXCLUDED.magnitude,
                "strongMagnitude"   = EXCLUDED."strongMagnitude",
                "positiveImbalance" = EXCLUDED."positiveImbalance";
    `, {
        magnitude: ORDER_OF_MAGNITUDE,
        strongMagnitude: STRONG_ORDER_OF_MAGNITUDE,
        positiveImbalance: IMPACT_POSITIVE_IMBALANCE,
    });
}
