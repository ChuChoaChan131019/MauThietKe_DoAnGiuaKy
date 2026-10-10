package com.senvia.doangiuaky.merchant.api;

import java.util.List;

/** Public query contract for pending shop requests. */
public interface MerchantShopRequestApi {

    List<PendingShopRequestCard> findPendingShopRequests();
}
